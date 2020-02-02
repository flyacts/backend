/*!
 * @copyright FLYACTS GmbH 2019
 */

import { Action } from '@flyacts/routing-controllers';
import cookie = require('cookie');
import { Request } from 'express';
import { Connection } from 'typeorm';

import { TokenEntity } from '../entities/token.entity';

/**
 * Create a authorization checker for routing controllers
 *
 * @param connection a typeorm connection
 */
export function createAuthorizationCheck(connection: Connection) {
    return async (action: Action, roles: string[]) => {
        const token = getTokenFromRequest(action.request);

        const tokenTentity = await connection.manager.findOne(TokenEntity, {
            where: {
                token: token,
            },
        });

        if (!(tokenTentity instanceof TokenEntity)) {
            return false;
        }

        if (roles.length > 0) {
            const hasRole = roles
                .filter(role => !role.startsWith('@SCOPE'))
                .map(role =>
                    tokenTentity
                        .user
                        .roles
                        .map(_role => _role.name)
                        .includes(role),
                )
                .filter(item => item === true)
                .length > 0;

            const hasScope = roles
                .filter(scope => scope.startsWith('@SCOPE'))
                .map(scope =>
                    tokenTentity
                        .scopes
                        .map(_scope => `@SCOPE/${_scope}`)
                        .includes(scope),
                )
                .filter(item => item === true)
                .length > 0;

            return hasRole || hasScope;
        }

        return true;
    };
}

/**
 * Try to extract token from request
 */
export function getTokenFromRequest(request: Request) {
    let token = request.headers['authorization'];

    if (typeof token !== 'string') {
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
