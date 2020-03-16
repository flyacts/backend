/*!
 * @copyright FLYACTS GmbH 2018
 */

import * as path from 'path';

/**
 * Check if the typeorm version of the backend is compatible with ours
 */
function CheckDependentVersions() {
    const ourPackageJson = require(path.resolve(__dirname, '../package.json'));

    const main = __dirname.split('node_modules').shift();

    if (typeof main === 'undefined') {
        return;
    }

    const theirPackageJson = require(path.resolve(main, 'package.json'));

    const dependencies = ['typeorm', 'class-validator'];

    let hasError = false;
    for (const dependency of dependencies) {
        const theirs = theirPackageJson.dependencies[dependency];
        const ours = ourPackageJson.dependencies[dependency];

        if (theirs !== ours) {
            // tslint:disable-next-line:no-console
            console.error(
                `Package ${dependency} mismatched local version (${ours}) with needed version (${theirs})`,
            );
            hasError = true;
        }
    }

    if (hasError) {
        process.exit(1);
    }
}

CheckDependentVersions();

export { VersionInformation } from './interfaces/version-information.interface';
export { Logger } from './providers/logger.provider';
export { Backend } from './backend';
export { BaseError } from './errors/base.error';
export { NoActiveSessionError } from './errors/no-active-session.error';
export { ValidationError } from './errors/validation.error';
export { NullAble } from './types/nullable.type';
export { HealthController } from './controllers/health.controller';
