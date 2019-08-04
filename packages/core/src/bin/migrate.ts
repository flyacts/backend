/*!
 * @copyright FLYACTS GmbH 2019
 */

import { Logger } from '@flyacts/backend-logger';
import config = require('config');
import * as path from 'path';
import { createConnection } from 'typeorm';

// tslint:disable-next-line:no-floating-promises
(async function() {
    const logger = new Logger();
    const connection = await createConnection({
        ...require(path.resolve(process.cwd(), 'ormconfig.json')),
        ...config.get('database'),
    });

    logger.info('Starting migrations');
    try {
        await connection.runMigrations({
            transaction: false,
        });
        logger.info('finished migrations');
        process.exit(0);
    } catch (error) {
        logger.error('failed to run migrations', error);
        process.exit(1);
    }
})();

