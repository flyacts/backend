/*!
 * @copyright FLYACTS GmbH 2019
 */

import { Logger } from '@flyacts/backend-logger';
import * as child_process from 'child_process';
import * as Docker from 'dockerode';
import * as path from 'path';
import * as minimist from 'minimist';

import serializeError = require('serialize-error');


import {
    DatabaseType,
    generateContainerName,
    getDatabaseType,
} from './setup-database';


const logger = new Logger();

/**
 * Run postgres instance running inside docker
 */
async function destroyDockerContainer() {
    const docker = new Docker();
    const containers = await docker.listContainers({
        all: true,
    });

    if (containers.length === 0) {
        process.exit(0);
        return;
    }

    for (const container of containers) {
        if (!container.Names.includes(`/${generateContainerName()}`)) {
            continue;
        }

        const _container = docker.getContainer(container.Id);

        if (container.State === 'running') {
            await _container.stop();
        }
        await _container.remove();
        logger.info('Successfully removed database container');
    }
}

/**
 * Shutdown a postgres instance that is running on this computer
 */
async function shutdownNativePostgres(databasePath: string) {
    const postgresStatus = child_process.spawnSync('pg_ctl', [
        `--pgdata=${databasePath}`,
        'status',
    ]).stdout.toString();

    if (postgresStatus.match(/PID: (\d+)/) !== null) {
        logger.info(`Stopping postgresql`);
        // start the database
        child_process.execFileSync('pg_ctl', [
            `--pgdata=${databasePath}`,
            'stop',
        ]);
    } else {
        logger.info('No database running. Do nothing…');
    }
}

// tslint:disable-next-line:no-floating-promises
(async function() {
    if (require.main !== module) {
        return;
    }

    logger.info('Tearing down database');

    try {
        const args = minimist((process.argv.slice(2)));
        const databaseTypeOption = args['db-type'];
        let databasePath = typeof args['db-path'] === 'string' ? args['db-path'] : 'database';
        if (!databasePath.startsWith('/')) {
            databasePath = path.resolve(process.cwd(), databasePath);
        }

        let databaseType;
        if (typeof databaseTypeOption === 'string') {
            if (databaseTypeOption === 'docker') {
                databaseType = DatabaseType.Docker;
            } else if (databaseType === 'native') {
                databaseType = DatabaseType.Native;
            } else {
                databaseType = await getDatabaseType();
            }
        } else {
            databaseType = await getDatabaseType();
        }

        if (databaseType === DatabaseType.Docker) {
            await destroyDockerContainer();
        } else if (databaseType === DatabaseType.Native) {
            await shutdownNativePostgres(databasePath);
        }
    } catch (error) {
        logger.error('failed to teardown the database', serializeError(error));
        process.exit(1);
    }
})();
