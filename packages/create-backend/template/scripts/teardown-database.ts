/*!
 * @copyright FLYACTS GmbH 2018
 */

import { Logger } from '@flyacts/backend';
import * as Docker from 'dockerode';

import { generateContainerName } from './setup-database';

// tslint:disable-next-line:no-floating-promises
(async function() {
    const logger = new Logger();
    logger.info('Tearing down database');

    try {
        const docker = new Docker();
        const containers = await docker.listContainers();
        if (containers.length === 0) {
            process.exit(0);
            return;
        }
        for (const container of containers) {
            if (!container.Names.includes(`/${generateContainerName()}`)) {
                continue;
            }

            const _container = docker.getContainer(container.Id);

            await _container.stop();
            await _container.remove();
            logger.info('Successfully removed database container');
        }
    } catch (error) {
        logger.error('failed to setup database', error);
        process.exit(1);
    }
})();
