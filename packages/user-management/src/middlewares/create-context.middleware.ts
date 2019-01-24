/*!
 * @copyright FLYACTS GmbH 2019
 */

import { Logger, RequestContext } from '@flyacts/backend';
import {
    TokenEntity,
    UserEntity,
} from '@flyacts/backend-user-management';
import * as cls from 'cls-hooked';
import {
    Request,
    Response,
} from 'express';
import {
    ExpressMiddlewareInterface,
    InternalServerError,
    Middleware,
} from 'routing-controllers';
import { Container } from 'typedi';
import { Connection } from 'typeorm';

import { UserManagementMetadata } from '../helpers/user-management-medata';

/**
 * Create the RequestContext for the current request
 */
@Middleware({ type: 'before' })
export class CreateContextMiddleware implements ExpressMiddlewareInterface {
    public async use(request: Request, _response: Response, next: (err?: unknown) => void) {
        // tslint:disable-next-line
        let session = cls.getNamespace(RequestContext.nsid);
        const requestContext = session.get(RequestContext.name);
        const token = request.get('authorization');
        const connection = Container.get<Connection>('connection');
        const logger = Container.get<Logger>(Logger);
        logger.debug(`Injecting user for token ${token} into requestContext`);
        session.run(async () => {
            session.set(RequestContext.name, requestContext);
            if (typeof token !== 'string') {
                next();
                return;
            }

            const tokenEntity = await connection.manager.findOne(TokenEntity, {
                where: {
                    token: token,
                },
            });

            if (!(tokenEntity instanceof TokenEntity)) {
                next();
                return;
            }

            const user = await connection.manager.findOne(UserEntity, tokenEntity.user.id);

            if (!(user instanceof UserEntity)) {
                throw new InternalServerError('Internal Server Error');
            }

            if (UserManagementMetadata.instance.userClass === UserEntity) {
                requestContext.user = user;
                next();
                return;
            }

            const currentUser = await connection.manager.findOne(UserManagementMetadata.instance.userClass, {
                where: {
                    user,
                },
            });

            if (!(currentUser instanceof UserManagementMetadata.instance.userClass)) {
                next(new InternalServerError('Internal Server Error'));
            } else {
                logger.debug(`Found user ${currentUser.id} with identity ${currentUser.toString()}`);
            }

            requestContext.user = currentUser;

            next();
        });
    }
}
