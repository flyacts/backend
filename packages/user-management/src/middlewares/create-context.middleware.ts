/*!
 * @copyright FLYACTS GmbH 2019
 */

import { RequestContext } from '@flyacts/request-context';
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

import { TokenEntity } from '../entities/token.entity';
import { UserEntity } from '../entities/user.entity';
import { UserManagementMetadata } from '../helpers/user-management-medata';

/**
 * Create the RequestContext for the current request
 */
@Middleware({ type: 'before' })
export class CreateContextMiddleware implements ExpressMiddlewareInterface {
    /**
     * Express middleware function to create a session
     */
    public async use(request: Request, _response: Response, next: (err?: unknown) => void) {
        // tslint:disable-next-line
        let session = cls.getNamespace(RequestContext.nsid);
        let requestContext: RequestContext;
        if (session.active === null) {
            session = cls.createNamespace(RequestContext.nsid);
            requestContext = new RequestContext();
        } else {
            requestContext = session.get(RequestContext.name);
        }
        const token = request.get('authorization');
        const connection = Container.get<Connection>('connection');
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
                this.setUserOnContext(requestContext, user);
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
            }
            this.setUserOnContext(requestContext, currentUser);

            next();
        });
    }

    /**
     * Write the user cont the request context
     */
    private setUserOnContext(context: RequestContext, user: unknown) {
        // tslint:disable-next-line:no-any
        let contextData = context.data as any;
        if (typeof contextData === 'undefined' || contextData === null) {
                contextData = {};
            }
            contextData.user = user;
            context.data = contextData;
    }
}
