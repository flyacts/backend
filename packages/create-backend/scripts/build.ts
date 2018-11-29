/*!
 * @copyright FLYACTS GmbH 2018
 */

import * as fs from 'fs-extra';
import * as shelljs from 'shelljs';

import logger from './logger';

// tslint:disable-next-line
(async function() {
    try {
        logger.info(`Build 'create-backend' package`);
        logger.info(`Compiling Typescript`);
        if (shelljs.exec('npm run --silent tsc').code !== 0) {
            throw new Error('Failed to build typescript ');
        }
        logger.info('Add shebang');
        const content = await fs.readFile('./dist/create-backend.js', 'utf-8');
        await fs.writeFile('./dist/create-backend.js', `#!/usr/bin/env node

${content}`);
        logger.info('Successfully build create-backend');
    } catch (error) {
        logger.error('Failed to execute command.');
        logger.error(error);
    }
})();
