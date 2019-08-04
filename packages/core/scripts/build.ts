/*!
 * @copyright FLYACTS GmbH 2018
 */

import { Logger } from '@flyacts/backend-logger';
import * as fs from 'fs-extra';
import * as shelljs from 'shelljs';

async function appendSheBang(file: string) {
    const content = await fs.readFile(file, 'utf-8');
    await fs.writeFile(file, `#!/usr/bin/env node

${content}`);
}

// tslint:disable-next-line
(async function () {
    const logger = new Logger();

    try {
        logger.info(`Build 'core' package`);
        logger.info(`Compiling Typescript`);
        if (shelljs.exec('npm run --silent tsc').code !== 0) {
            throw new Error('Failed to build typescript ');
        }
        logger.info('Add shebang');
        await appendSheBang('./dist/bin/democontent.js');
        await appendSheBang('./dist/bin/migrate.js');
        await appendSheBang('./dist/bin/setup-database.js');
        await appendSheBang('./dist/bin/teardown-database.js');
        logger.info('Successfully build core');
    } catch (error) {
        logger.error('Failed to execute command.');
        logger.error(error);
    }
})();
