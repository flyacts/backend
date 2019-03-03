/*!
 * @copyright FLYACTS GmbH 2018
 */


import { Backend } from '@flyacts/backend';
import { MediaConfiguration } from '@flyacts/backend-media-management';
import { CreateContextMiddleware, UserManagementMetadata } from '@flyacts/backend-user-management';
import * as config from 'config';
import * as fs from 'fs-extra';
import 'reflect-metadata';
import Container from 'typedi';

import { HealthController } from './controllers/health.controller';
import { UserController } from './controllers/user.controller';
import { UserExtensionEntity } from './entities/user-extension.entity';

const controllers = [
    HealthController,
    UserController,
];

UserManagementMetadata.instance.userClass = UserExtensionEntity;

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

    const mediaLocation = config.get<string>('media.directory');
    if (!(await fs.pathExists(mediaLocation))) {
        throw new Error('Media Location does not exists');
    }

    const mediaConfig = new MediaConfiguration(mediaLocation);
    mediaConfig.tempDir = config.get<string>('media.tmpdir');

    Container.set(MediaConfiguration, mediaConfig);

    return Backend.create(
        typeOrmConfig,
        controllers,
        [CreateContextMiddleware],
        {
            name: '',
            description: '',
            version: '',
        },
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
