/*!
 * @copyright FLYACTS GmbH 2019
 */

import {
    Action,
    InternalServerError,
} from 'routing-controllers';
import { Connection } from 'typeorm';

import { TokenEntity } from '../entities/token.entity';
import { UserEntity } from '../entities/user.entity';

import { UserManagementMetadata } from './user-management-medata';

/**
 * Create a current user checker for routing controllers
 *
 * @param connection a typeorm connection
 */
export function createCurrentUserChecker(
    connection: Connection,
) {
    return async (action: Action) => {
        const token = action.request.headers['authorization'];

        if (typeof token !== 'string') {
            return undefined;
        }

        const tokenEntity = await connection.manager.findOne(TokenEntity, {
            where: {
                token: token,
            },
        });

        if (!(tokenEntity instanceof TokenEntity)) {
            return undefined;
        }

        const user = await connection.manager.findOne(UserEntity, tokenEntity.user.id);

        if (!(user instanceof UserEntity)) {
            throw new InternalServerError('Internal Server Error');
        }

        const userClass = UserManagementMetadata.instance.userClass;

        if (userClass === UserEntity) {
            return user;
        }

        return connection.manager.findOne(userClass, {
            where: {
                user,
            },
        });

    };
}
