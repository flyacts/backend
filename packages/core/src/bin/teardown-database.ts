/*!
 * @copyright FLYACTS GmbH 2019
 */

import { Logger } from '@flyacts/backend-logger';
import * as Docker from 'dockerode';
import * as minimist from 'minimist';
import * as path from 'path';
import serializeError = require('serialize-error');


import {
    generateContainerName, containerSuffix,
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
        const eligibleForDestruction = container
            .Names
            .map(item =>
                item === `/${generateContainerName()}` ||
                item.endsWith(containerSuffix))
            .includes(true);

        if (!eligibleForDestruction) {
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


// tslint:disable-next-line:no-floating-promises
(async function () {
    if (require.main !== module) {
        return;
    }

    logger.info('Tearing down database');

    try {
        const args = minimist((process.argv.slice(2)));

        let databasePath = typeof args['db-path'] === 'string' ?
            args['db-path'] :
            'database';

        if (!databasePath.startsWith('/')) {
            databasePath = path.resolve(process.cwd(), databasePath);
        }

        await destroyDockerContainer();
    } catch (error) {
        logger.error('failed to teardown the database', serializeError(error));
        process.exit(1);
    }
})();
