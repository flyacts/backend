/*!
 * @copyright FLYACTS GmbH 2018
 */


import 'reflect-metadata';

import { Backend } from '@flyacts/backend';
import * as config from 'config';

import { HealthController } from './controllers/health.controller';
import { UserExtensionEntity } from './entities/user-extension.entity';

const controllers = [
    HealthController,
];

if (typeof process.env.NODE_ENV === 'undefined') {
    process.env.NODE_ENV = 'development';
}

/**
 * Start the app
 */
export async function startApp() {
    const typeOrmConfig = {
        ...require('../ormconfig.json'),
        ...config.get('database'),
    };

    return Backend.create(
        typeOrmConfig,
        controllers,
        {
            name: '',
            description: '',
            version: '',
        },
        UserExtensionEntity,
    );
}

if (process.env.NODE_ENV !== 'test') {
    (async function() {
        try {
            const be = await startApp();

            await be.start();
        } catch (error) {
            // tslint:disable-next-line
            console.error(error);

            process.exit(-1);
        }
    })();
}
