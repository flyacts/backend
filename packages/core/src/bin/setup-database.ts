/*!
 * @copyright FLYACTS GmbH 2019
 */

import { Logger } from '@flyacts/backend-logger';
import * as child_process from 'child_process';
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
const _hasBin = require('hasbin') as (binary: string, callback: (result: boolean) => void) => void;

export enum DatabaseType {
    Raw,
    Docker,
    None,
}

interface ConnectionInformation {
    host: string;
    port: number;
}

/**
 * Check if binary is in path
 */
async function hasBin(binary: string) {
    return new Promise<boolean>((resolve) => {
        _hasBin(binary, (result) => { resolve(result); });
    });
}

/**
 * sleep for time miliseconds
 */
async function sleep(time: number) {
    return new Promise(resolve => setTimeout(resolve, time));
}

/**
 * Helper to check if the postgres database is running
 */
async function checkIfPostgresIsRunning(connection: ConnectionInformation, databaseName: string, timeout?: number) {
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
    return `${packageConfig.name.replace('@', '').replace('/', '-')}-local-database`;
}

/**
 * Determins if a local postgres binary is used or the database is run by docker
 */
export async function getDatabaseType() {
    if (await hasBin('initdb')) {
        return DatabaseType.Raw;
    }
    else {
        try {
            const docker = new Docker();
            if (docker instanceof Docker) {
                return DatabaseType.Docker;
            } else {
                return DatabaseType.None;
            }
        } catch (error) {
            return DatabaseType.None;
        }
    }
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
        configContent.database = { host: ipAddress };
        await fs.writeFile(configPath, JSON.stringify(configContent, undefined, 4));
        return ipAddress;
    } else {
        throw new Error('could not cobtain container information');
    }
}

/**
 * Use docker to setup a database
 */
async function setupDockerDatabase(persitant: boolean, databaseName: string): Promise<ConnectionInformation> {
    const binds = [];
    if (persitant === true) {
        const databasePath = path.resolve(process.cwd(), 'database');
        binds.push(`${databasePath}:/var/lib/postgresql/data`);
    }
    let ipAddress = '127.0.0.1';
    let port = 15432;

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
                port = 5432;
            }
            await checkIfPostgresIsRunning({ host: ipAddress, port: 15432 }, databaseName, 5);
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
    const database = await docker.createContainer({
        Image: 'postgres:10',
        name: containerName,
        Env: [
            `POSTGRES_DB=${databaseName}`,
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
        port = 5432;
    }
    logger.info('Successfully started database container');

    return {
        host: ipAddress,
        port,
    };
}

/**
 * Check if the file exists
 */
async function fileExists(file: string) {
    try {
        await fs.access(file);
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Setup a native database
 */
async function setupRawDatabase(databaseName: string) {
    const databasePath = path.resolve(process.cwd(), 'database');
    // first lets check if database is initialized
    if (!(await fileExists(path.resolve(databasePath, 'PG_VERSION')))) {
        // it is not, do it then
        shelljs.exec(`initdb --pgdata "${databasePath}" --username postgres`);
        // copy our config into the database folder and customize it
        const _config = `listen_addresses = '127.0.0.1'
port = 15432
max_connections = 100
unix_socket_directories = '<socket-folder>'
shared_buffers = 128MB
log_timezone = 'UTC'
datestyle = 'iso, dmy'
timezone = 'UTC'`;
        await fs.writeFile(
            path.resolve(databasePath, 'postgresql.conf'),
            _config.replace('<socket-folder>', databasePath),
        );
    }

    // check if postgres is already running
    logger.info('Check if postgres is already running');
    const postgresStatus = child_process.spawnSync('pg_ctl', [
        `--pgdata=${databasePath}`,
        'status',
    ]).stdout.toString();

    if (postgresStatus.match(/PID: (\d+)/) === null) {
        logger.info(`Starting database with pgdate=${databasePath}`);
        // start the database
        child_process.execFileSync('pg_ctl', [
            `--pgdata=${databasePath}`,
            'start',
        ], { stdio: 'inherit' });
    } else {
        logger.info('Postgres is already running…');
    }

    await sleep(2000);

    logger.info('check if the database exists in postgres');

    const databaseStatus = child_process.spawnSync('psql', [
        '--host=127.0.0.1',
        '--port=15432',
        '--username=postgres',
        '-l',
    ]).stdout.toString();

    if (databaseStatus.match(databaseName) === null) {
        logger.info(`Creating the database ${databaseName}`);
        shelljs.exec(`createdb --host=127.0.0.1 --port=15432 --username=postgres ${databaseName}`);
    } else {
        logger.info(`Database ${databaseName} already exists`);
    }

    return {
        host: '127.0.0.1',
        port: 15432,
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
        const databaseName = config.get<string>('database.database');
        let connection: ConnectionInformation;
        const databaseType = await getDatabaseType();
        if (databaseType === DatabaseType.Docker) {
            connection = await setupDockerDatabase(args.persistant, databaseName);
        } else if (databaseType === DatabaseType.Raw) {
            connection = await setupRawDatabase(databaseName);
        } else {
            throw new Error('No Database available');
        }

        logger.info(`Trying to establish a connection to the database on ${connection.host}:${connection.port}`);
        await checkIfPostgresIsRunning(connection, databaseName);
        logger.info('Database is ready to connect');
        process.exit(0);
    } catch (error) {
        logger.error('failed to setup database', serializeError(error));
        process.exit(1);
    }
})();
