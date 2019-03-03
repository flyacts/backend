/*!
 * @copyright FLYACTS GmbH 2018
 */

import { Logger } from '@flyacts/backend';
import * as config from 'config';
import * as Docker from 'dockerode';
import * as fs from 'fs-extra';
import minimist = require('minimist');
import * as path from 'path';
import * as pg from 'pg';

/**
 * sleep for time miliseconds
 */
async function sleep(time: number) {
    return new Promise(resolve => setTimeout(resolve, time));
}

/**
 * Generate a meaningfull packagename from the package name
 */
export function generateContainerName() {
    const packageConfig = require(path.resolve(__dirname, '../package.json'));
    return `${packageConfig.name.replace('@', '').replace('/', '-')}-local-database`;
}

// tslint:disable-next-line:no-floating-promises
(async function() {
    const logger = new Logger();
    logger.info('Setting up database');

    try {
        const args = minimist((process.argv.slice(2)));
        const binds = [];
        if (args.persistant === true) {
            const databasePath = path.resolve(__dirname, '../database');
            binds.push(`${databasePath}:/var/lib/postgresql/data`);
        }
        const docker = new Docker();
        logger.info('Pulling postgres image');
        await (new Promise((resolve, reject) => {
            docker.pull('postgres:10', {}, (err, stream) => {
                if (err) {
                    reject(err);
                }
                docker.modem.followProgress(stream, (_err: unknown) => {
                    // tslint:disable-next-line
                    if (_err) {
                        reject(err);
                    }
                    resolve();
                });
            });
        }));

        logger.info('Creating postgres container');
        const databaseName  = config.get<string>('database.database');
        const database = await docker.createContainer({
            Image: 'postgres:10',
            name: generateContainerName(),
            Env: [
                `POSTGRES_DB=${databaseName}`,
            ],
            HostConfig: {
                Binds: binds,
                PortBindings: {
                    '5432/tcp': [
                        {
                            HostIp: '127.0.0.1',
                            HostPort: '5432',
                        },
                    ],
                },
            },
        });

        await database.start();
        const containerInfo = (await docker.listContainers()).filter(item => item.Id === database.id).pop();
        let ipAddress: string | undefined;
        if (args.local === true) {
            ipAddress = '127.0.0.1';
        } else if (typeof containerInfo !== 'undefined') {
            const configPath = path.resolve(__dirname, '../config/test.json');
            const configContent = require(configPath);
            ipAddress = containerInfo.NetworkSettings.Networks.bridge.IPAddress;
            configContent.database = { host: ipAddress };
            await fs.writeFile(configPath, JSON.stringify(configContent, undefined, 4));
        }
        logger.info('Successfully started database container');
        logger.info('Trying to establish a connection to the database');
        while (true) {
            try {
                const client = new pg.Client({
                    host: ipAddress,
                    user: 'postgres',
                    database: databaseName,
                });
                await client.connect();
                break;
            } catch (error) {
                // tslint:disable-next-line
                logger.debug('failed to connect');
            }
            await sleep(1000);
        }
        logger.info('Database is ready to connect');
        process.exit(0);
    } catch (error) {
        logger.error('failed to setup database', error);
        process.exit(1);
    }
})();
