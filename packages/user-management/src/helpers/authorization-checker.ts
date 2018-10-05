/**
 * @copyright FLYACTS GmbH 2018
 */

import { Action } from 'routing-controllers';
import { Connection } from 'typeorm';

import { TokenEntity } from '../entities/token.entity';

/**
 * Create a authorization checker for routing controllers
 *
 * @param connection a typeorm connection
 */
export function createAuthorizationCheck(connection: Connection) {
    return async (action: Action, roles: string[]) => {
        const token = action.request.headers['authorization'];

        if (typeof token !== 'string') {
            return false;
        }

        const tokenTentity = await connection.manager.findOne(TokenEntity, {
            where: {
                value: token,
            },
        });

        if (!(tokenTentity instanceof TokenEntity)) {
            return false;
        }

        if (roles.length > 0) {
            return roles
                .map(role =>
                    tokenTentity
                        .user
                        .roles
                        .map(_role => _role.name)
                        .includes(role),
                )
                .filter(item => item === true)
                .length > 0;
        }

        return true;
    };
}
