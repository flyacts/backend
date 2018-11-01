/**
 * @copyright FLYACTS GmbH 2018
 */

import {
    Action,
    InternalServerError,
} from 'routing-controllers';
import { Connection } from 'typeorm';

import { TokenEntity } from '../entities/token.entity';
import { UserEntity } from '../entities/user.entity';

interface UserExtensionConstructor<T> {
    new(): T;
}

/**
 * Create a current user checker for routing controllers
 *
 * @param connection a typeorm connection
 */
export function createCurrentUserChecker<T>(
    connection: Connection,
    userExtension: UserExtensionConstructor<T> | undefined,
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

        if (!(typeof userExtension === 'function')) {
            return user;
        }

        return connection.manager.findOne(userExtension, {
            where: {
                user,
            },
        });

    };
}
