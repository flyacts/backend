/*!
 * @copyright FLYACTS GmbH 2019
 */

import { Logger } from '@flyacts/backend-logger';
import config = require('config');
import { createConnection } from 'typeorm';


// tslint:disable-next-line:no-floating-promises
(async function() {
    const logger = new Logger();
    const connection = await createConnection({
        ...require('../ormconfig.json'),
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
        logger.error('failed to run democontent', error);
        process.exit(1);
    }
})();
