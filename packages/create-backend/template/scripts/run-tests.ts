/*!
 * @copyright FLYACTS GmbH 2019
 */

import { Logger } from '@flyacts/backend-logger';
import * as child_process from 'child_process';
import * as minimist from 'minimist';

/**
 * Run the method
 */
async function run() {
    const logger = new Logger('debug');
    const processArgs = minimist((process.argv.slice(2)));

    const collectCoverage = processArgs.coverage === true;

    try {
        logger.info('starting the database');
        child_process.execFileSync('setup-database', ['--persistant'], { stdio: 'inherit' });
        const args = [
            '--async-stack-traces',
        ];
        if (processArgs.debug === true) {
            args.push('--inspect-brk');
        }
        if (collectCoverage) {
            logger.info('Starting the test suite and collect coverage reports');
            child_process.execFileSync(
                'nyc',
                [
                    'mocha',
                    'tests/**/*.test.ts',
                ],
                { stdio: 'inherit' },
            );
        } else {
            logger.info('Starting the test suite');
            args.push(
                './node_modules/.bin/_mocha',
                'tests/**/*.test.ts',
            );
            child_process.execFileSync(
                'node',
                args,
                { stdio: 'inherit' },
            );
        }
        logger.info('Finished test suite');
    } catch (error) {
        logger.error('Failed at executing the test suite', {
            status: error.status,
            message: error.message,
        });
        process.exit(1);
    }
}

// tslint:disable-next-line:no-floating-promises
run();
