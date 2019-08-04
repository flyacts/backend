/*!
 * @copyright FLYACTS GmbH 2018
 */

import 'reflect-metadata';

// reflect metadata must be always first
// tslint:disable-next-line:ordered-imports
import { Logger } from '@flyacts/backend';
import config = require('config');
import serializeError = require('serialize-error');
import Container from 'typedi';
import { Connection, createConnection } from 'typeorm';

import { JobManager } from '../providers/job-manager.provider';

type startUpFunction = () => Promise<void>;

// tslint:disable-next-line:no-floating-promises
(async function() {
    const logger = new Logger();

    try {
        logger.info('Starting Job Runner');

        const connection = await createConnection({
            ...require('../ormconfig.json'),
            ...config.get('database'),
        });
        Container.set(Connection, connection);
        Container.set('connection', connection);

        const startupFunctions = Container.getMany<startUpFunction>('JobManagerStart');

        for (const func of startupFunctions) {
            await func();
        }

        const jobManager = Container.get(JobManager);
        await jobManager.runQueues();
    } catch (error) {
        logger.error('Failure running TaskRunner ', serializeError(error));
        process.exit(1);
    }
})();
