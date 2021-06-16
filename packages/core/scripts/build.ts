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
        logger.info('Copy Schematics JSON files');
        await fs.copy('./src/schematics/entity/schema.json', './dist/schematics/entity/schema.json');
        await fs.copy('./src/schematics/controller/schema.json', './dist/schematics/controller/schema.json');
        await fs.copy('./src/schematics/migration/schema.json', './dist/schematics/migration/schema.json');
        shelljs.cp('-r', './src/schematics/entity/files', './dist/schematics/entity');
        shelljs.cp('-r', './src/schematics/controller/files', './dist/schematics/controller');
        shelljs.cp('-r', './src/schematics/migration/files', './dist/schematics/migration');
        logger.info('Add shebang');
        await appendSheBang('./dist/bin/democontent.js');
        await appendSheBang('./dist/bin/migrate.js');
        await appendSheBang('./dist/bin/setup-database.js');
        await appendSheBang('./dist/bin/teardown-database.js');
        logger.info('Successfully build core');
    } catch (error) {
        logger.error('Failed to execute command.');
        logger.error(error);
        process.exit(1);
    }
})();
