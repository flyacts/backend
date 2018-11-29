import * as shelljs from 'shelljs';
import * as fs from 'fs-extra';
import logger from './logger';

(async function() {
    try {
        logger.info(`Build 'create-backend' package`);
        logger.info(`Compiling Typescript`);
        if (shelljs.exec('npm run --silent tsc').code !== 0) {
            throw new Error('Failed to build typescript ');
        }
        logger.info('Add shebang');
        let content = await fs.readFile('./dist/create-backend.js', 'utf-8');
        await fs.writeFile('./dist/create-backend.js', `#!/usr/bin/env node

${content}`);
        logger.info('Successfully build create-backend');
    } catch(error) {
        logger.error('Failed to execute command.')
        logger.error(error);
    }
})();
