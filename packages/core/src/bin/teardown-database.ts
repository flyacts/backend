/*!
 * @copyright FLYACTS GmbH 2019
 */

import { Logger } from '@flyacts/backend-logger';
import * as child_process from 'child_process';
import * as Docker from 'dockerode';
import * as path from 'path';

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
async function shutdownNativePostgres() {
    const databasePath = path.resolve(process.cwd(), 'database');
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
        const databaseType = await getDatabaseType();

        if (databaseType === DatabaseType.Docker) {
            await destroyDockerContainer();
        } else if (databaseType === DatabaseType.Raw) {
            await shutdownNativePostgres();
        }
    } catch (error) {
        logger.error('failed to teardown the database', error);
        process.exit(1);
    }
})();
