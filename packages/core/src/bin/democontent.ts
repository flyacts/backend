/*!
 * @copyright FLYACTS GmbH 2019
 */

import { Logger } from '@flyacts/backend-logger';
import config = require('config');
import * as path from 'path';
import * as serializeError from 'serialize-error';
import { createConnection } from 'typeorm';

// tslint:disable-next-line:no-submodule-imports
require('ts-node/register');

// tslint:disable-next-line:no-floating-promises
(async function() {
    const logger = new Logger();
    const connection = await createConnection({
        ...require(path.resolve(process.cwd(), 'ormconfig.json')),
        ...config.get('database'),
    });

    logger.info('Starting democontent');
    try {
        process.env.USE_DEMOCONTENT = 'yes';
        await connection.runMigrations({
            transaction: false,
        });
        logger.info('finished democontent');
        process.exit(0);
    } catch (error) {
        logger.error('failed to run democontent', serializeError(error));
        process.exit(1);
    }
})();
