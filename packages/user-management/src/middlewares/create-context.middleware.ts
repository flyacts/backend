/*!
 * @copyright FLYACTS GmbH 2019
 */

import { RequestContext } from '@flyacts/request-context';
import {
    ExpressMiddlewareInterface,
    InternalServerError,
    Middleware,
} from '@flyacts/routing-controllers';
import {
    Request,
    Response,
} from 'express';
import { Container } from 'typedi';
import { Connection } from 'typeorm';

import { TokenEntity } from '../entities/token.entity';
import { UserEntity } from '../entities/user.entity';
import { getTokenFromRequest } from '../helpers/authorization-checker';
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

        const token = getTokenFromRequest(request);
        const connection = Container.get<Connection>('connection');
        const namespace = RequestContext.obtainNamespace();
        const requestContext = new RequestContext();
        namespace.enterWith(requestContext);
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
