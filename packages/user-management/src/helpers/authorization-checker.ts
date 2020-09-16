/*!
 * @copyright FLYACTS GmbH 2019
 */

import { Action } from '@flyacts/routing-controllers';
import cookie = require('cookie');
import { Request } from 'express';
import { Connection } from 'typeorm';

import { TokenEntity } from '../entities/token.entity';
import { Scopes } from '../enums/scopes.enum';

const SCOPE_PREFIX = '@SCOPE';
const PERMISSION_PREFIX = '@PERMISSION';

/**
 * Create a checker for `@Authorized`-statements in the backend
 *
 * This checker checks if any of the passed restrictables are are available.
 *
 * You can pass regular user roles, permissions (with the prefix `@PERMISSION/`),
 * specialy scoped tokens (with the prefix `@SCOPE/`).
 *
 * If a token is issued for a specific scope it cannot be used to check for group
 * or permission membership.
 *
 * @param connection a typeorm connection
 */
// tslint:disable-next-line:cognitive-complexity
export function createAuthorizationCheck(connection: Connection) {
    // tslint:disable-next-line:mccabe-complexity
    return async (action: Action, restrictables: string[]) => {
        const token = getTokenFromRequest(action.request);

        const tokenEntity = await connection.manager.findOne(TokenEntity, {
            where: {
                token: token,
            },
        });

        if (!(tokenEntity instanceof TokenEntity)) {
            return false;
        }

        const isAuthorizationToken = tokenEntity.scopes.includes(Scopes.Authorization);

        if (restrictables.length === 0) {
            return isAuthorizationToken;
        }

        for (const restrictable of restrictables) {
            if (restrictable.startsWith(SCOPE_PREFIX)) {
                const hasCorrectScope = tokenEntity
                    .scopes
                    .map(item => `${SCOPE_PREFIX}/${item}`)
                    .includes(restrictable);

                if (hasCorrectScope) {
                    return true;
                }
            } else if (restrictable.startsWith(PERMISSION_PREFIX)) {
                const userRoles = tokenEntity.user.roles;

                for (const userRole of userRoles) {
                    for (const permission of userRole.permissions) {
                        if (restrictable === `${PERMISSION_PREFIX}/${permission.name}` && isAuthorizationToken) {
                            return true;
                        }
                    }
                }
            } else {
                const hasRole = tokenEntity.user.hasRole(restrictable);

                if (isAuthorizationToken && hasRole) {
                    return true;
                }
            }
        }

        return false;
    };
}

/**
 * Try to extract token from request
 */
export function getTokenFromRequest(request: Request) {
    let token = request.headers['authorization'];

    if (typeof token !== 'string' && typeof request.query.token === 'string') {
        token = request.query.token;
    }

    if (typeof token !== 'string' &&
        (typeof request.headers.cookie === 'string')) {
        const cookies = cookie.parse(request.headers.cookie);
        token = cookies.authorization;
    }

    if (typeof token !== 'string') {
        return undefined;
    }

    return token;
}
