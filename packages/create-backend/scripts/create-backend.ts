/*!
 * @copyright FLYACTS GmbH 2018
 */

import * as child_process from 'child_process';
import * as fs from 'fs-extra';
import * as nodeEmoji from 'node-emoji';
import * as path from 'path';
import * as shelljs from 'shelljs';

import logger from './logger';

// tslint:disable-next-line
(async function() {
    try {
        const currentPath = shelljs.pwd().stdout;
        logger.debug('Generating FLYACTS Backend');
        const templateDirectory = path.resolve(
            path.dirname(
                await fs.realpath(process.argv[1]),
            ),
            '..',
            'template',
        );

        if (await fs.pathExists(path.resolve(currentPath, 'package.json')) === true) {
            logger.error('package.json already exists, please bootstrap a backend only in an empty directory');
            process.exit(-1);
        }
        logger.debug('Initializing Git');
        shelljs.exec(`git init`);
        shelljs.exec(`git checkout -b develop`);
        logger.debug('Copying files…');
        await fs.copy(templateDirectory, process.cwd(), {
            recursive: true,
            errorOnExist: true,
        });
        logger.debug('Initialize package.json');
        child_process.execFileSync('npm', ['init'], {stdio: 'inherit'});
        logger.debug('Installing dependencies');
        const packages = [
            '@flyacts/backend@0.2.1',
            '@flyacts/backend-core-entities@0.11.0',
            '@flyacts/backend-crud-service@0.5.2',
            '@flyacts/backend-user-management@0.9.3',
            'body-parser',
            'class-transformer',
            'class-validator',
            'config',
            'express',
            'faker',
            'fs-extra',
            'isemail',
            'moment',
            'multer',
            'pg',
            'reflect-metadata',
            'routing-controllers',
            'sqlite3',
            'typedi',
            'typeorm@0.2.8',
            'uid-generator',
            'winston',
            'zxcvbn',
        ];
        shelljs.exec(`npm install --silent --save-exact --save ${packages.join(' ')}`);
        logger.debug('Installing dev dependencies');
        const devDependencies = [
            '@commitlint/cli',
            '@commitlint/config-conventional',
            '@flyacts/tslint-config',
            '@types/body-parser',
            '@types/chai',
            '@types/config',
            '@types/express',
            '@types/faker',
            '@types/fs-extra',
            '@types/jest',
            '@types/js-yaml',
            '@types/minimist',
            '@types/multer',
            '@types/nock',
            '@types/node-emoji',
            '@types/react-dom',
            '@types/react',
            '@types/sparkpost',
            '@types/supertest',
            '@types/zxcvbn',
            'chai',
            'cross-fetch',
            'husky',
            'jest',
            'js-yaml',
            'minimist',
            'nodemon',
            'nock',
            'supertest',
            'ts-jest',
            'ts-node',
            'tslint',
            'tslint-language-service',
            'typescript',
        ];
        shelljs.exec(`npm install --silent --save-exact --save-dev ${devDependencies.join(' ')}`);
        logger.info('write .gitignore');
        await fs.writeFile('.gitignore', ['node_modules', 'dist', 'database.db'].join('\n'));
        logger.info('Crafting initial commit');
        shelljs.exec('git add -A');
        shelljs.exec('git commit --message="chore: initial commit"');
        logger.info(`Successfully scaffolded your backend! ${nodeEmoji.get('rocket')} ${nodeEmoji.get('tada')}`);
        process.exit(0);
    } catch (error) {
        logger.error('Failed to execute command.');
        logger.error(error);
        process.exit(-1);
    }
})();
