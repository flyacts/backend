/*!
 * @copyright FLYACTS GmbH 2019
 */

import { Logger } from '@flyacts/backend-logger';
import * as config from 'config';
import * as Docker from 'dockerode';
import * as fs from 'fs-extra';
import minimist = require('minimist');
import * as path from 'path';
import * as pg from 'pg';
import serializeError = require('serialize-error');
import * as shelljs from 'shelljs';

const logger = new Logger();
const isCI = require('is-ci') as boolean;

interface ConnectionInformation {
    host: string;
    port: number;
}

export const containerSuffix = 'local-database';

/**
 * sleep for time miliseconds
 */
async function sleep(time: number) {
    return new Promise(resolve => setTimeout(resolve, time));
}

/**
 * Helper to check if the postgres database is running
 */
async function checkIfPostgresIsRunning(
    connection: ConnectionInformation,
    databaseName: string,
    timeout?: number,
) {
    let running = 0;
    while (true) {
        if (typeof timeout === 'number' && running >= timeout) {
            throw new Error('Could not connect to database in time');
        }
        try {
            const client = new pg.Client({
                host: connection.host,
                port: connection.port,
                user: 'postgres',
                database: databaseName,
            });
            await client.connect();
            break;
        } catch (error) {
            // tslint:disable-next-line
            logger.error('failed to connect');
        }
        await sleep(1000);
        running++;
    }
}

/**
 * Generate a meaningfull packagename from the package name
 */
export function generateContainerName() {
    const packageConfig = require(path.resolve(process.cwd(), 'package.json'));
    return `${packageConfig.name.replace('@', '').replace('/', '-')}-${containerSuffix}`;
}


/**
 * Extract the ip address of the container
 */
async function extractIpFromContainer(docker: Docker, containerId: string) {
    const containerInfo = (await docker.listContainers())
        .filter(item => item.Id === containerId)
        .pop();
    if (typeof containerInfo !== 'undefined') {
        const configPath = path.resolve(process.cwd(), 'config/test.json');
        const configContent = require(configPath);
        const ipAddress = containerInfo.NetworkSettings.Networks.bridge.IPAddress;
        configContent.database = {
            ...configContent.database,
            host: ipAddress,
        };
        await fs.writeFile(configPath, JSON.stringify(configContent, undefined, 4));
        return ipAddress;
    } else {
        throw new Error('could not cobtain container information');
    }
}

/**
 * Pull a docker image and resolve when its finished
 */
async function pullDockerImage(docker: Docker, name: string) {
    return (new Promise((resolve, reject) => {
        docker.pull(name, {}, (err, stream) => {
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
}

/**
 * Use docker to setup a database
 */
async function setupDockerDatabase(
    persistent: boolean,
    databaseName: string,
    databasePath: string,
    dockerImage: string,
): Promise<ConnectionInformation> {
    const binds = [];
    if (persistent === true) {
        binds.push(`${databasePath}:/var/lib/postgresql/data`);
    }
    let ipAddress = '127.0.0.1';
    const port = (isCI ? 5432 : 15432);

    const containerName = generateContainerName();
    const docker = new Docker();
    const preStartContainerInfo = (await docker.listContainers({ all: true }))
        .filter(item => item.Names[0] === `/${containerName}`)
        .pop();

    if (typeof preStartContainerInfo === 'object') {
        logger.info(`Found running container ${containerName}`);
        try {
            if (isCI) {
                ipAddress = await extractIpFromContainer(docker, preStartContainerInfo.Id);
            }
            await checkIfPostgresIsRunning({ host: ipAddress, port }, databaseName, 5);
            logger.info('Successfully recycled container');
            return {
                host: ipAddress,
                port,
            };
        } catch (error) {
            logger.error('Failed to connect to database. Cleaning up and then recreate container.');
            shelljs.exec('npm run -s teardown-database');
        }
    }

    logger.info('Pulling postgres image');

    await pullDockerImage(docker, dockerImage);

    logger.info('Creating postgres container');
    const database = await docker.createContainer({
        Image: dockerImage,
        name: containerName,
        Env: [
            `POSTGRES_DB=${databaseName}`,
            /**
             * We use the trust model here because the database is
             * intended to run local on the developers computer or
             * in a CI environment where outside acces should not be
             * possible
             */
            'POSTGRES_HOST_AUTH_METHOD=trust',
        ],
        HostConfig: {
            Binds: binds,
            PortBindings: (!isCI ? {
                '5432/tcp': [
                    {
                        HostIp: '127.0.0.1',
                        HostPort: '15432',
                    },
                ],
            } : undefined),
        },
    });

    await database.start();
    if (isCI) {
        ipAddress = await extractIpFromContainer(docker, database.id);
    }
    logger.info('Successfully started database container');

    return {
        host: ipAddress,
        port,
    };
}

// tslint:disable-next-line:no-floating-promises
(async function() {
    if (require.main !== module) {
        return;
    }
    logger.info('Setting up database');

    try {
        const args = minimist((process.argv.slice(2)));
        let databasePath = typeof args['db-path'] === 'string' ?
            args['db-path'] :
            'database';

        const dockerImageArg = process.argv.filter(arg => arg.includes('docker-image=')).shift();
        const dockerImage = typeof dockerImageArg === 'string' ?
            dockerImageArg.split('docker-image=')[1] :
            'postgres:12';

        if (!databasePath.startsWith('/')) {
            databasePath = path.resolve(process.cwd(), databasePath);
        }

        const databaseName = config.get<string>('database.database');

        let connection: ConnectionInformation;

        connection = await setupDockerDatabase(args.persistent, databaseName, databasePath, dockerImage);

        logger.info(`Trying to establish a connection to the database on ${connection.host}:${connection.port}`);

        await checkIfPostgresIsRunning(connection, databaseName);

        logger.info('Database is ready to connect');
        process.exit(0);
    } catch (error) {
        logger.error('failed to setup database', serializeError(error));
        process.exit(1);
    }
})();
