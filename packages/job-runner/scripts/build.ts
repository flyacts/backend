/*!
 * @copyright FLYACTS GmbH 2018
 */

import { Logger } from '@flyacts/backend-logger';
import * as fs from 'fs-extra';
import * as shelljs from 'shelljs';

// tslint:disable-next-line
(async function () {
    const logger = new Logger();

    try {
        logger.info(`Build 'create-backend' package`);
        logger.info(`Compiling Typescript`);
        if (shelljs.exec('npm run --silent tsc').code !== 0) {
            throw new Error('Failed to build typescript ');
        }
        logger.info('Add shebang');
        const content = await fs.readFile('./dist/bin/job-runner.js', 'utf-8');
        await fs.writeFile('./dist/bin/job-runner.js', `#!/usr/bin/env node

${content}`);
        logger.info('Successfully build job runner');
    } catch (error) {
        logger.error('Failed to execute command.');
        logger.error(error);
    }
})();
