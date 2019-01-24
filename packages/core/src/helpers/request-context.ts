/*!
 * @copyright FLYACTS GmbH 2018
 */

import * as cls from 'cls-hooked';

import { NoActiveSessionError } from '../errors/no-active-session.error';

/**
 * An interface for cls-hooked
 */
export class RequestContext {

    public user?: unknown;
    public readonly id: number;

    public static nsid = '94799794-063d-497c-ae51-f614fdb17cb3';

    public constructor() {
        this.id = Math.random();
    }

    /**
     * Returns the current requestContext
     */
    public static currentRequestContext(): RequestContext {
        const session = cls.getNamespace(RequestContext.nsid);

        if (typeof session.active !== 'object') {
            throw new NoActiveSessionError();
        }

        return session.get(RequestContext.name);
    }

    /**
     * Returns the current user of the request
     */
    public static currentUser(): unknown | undefined {
        const requestContext = RequestContext.currentRequestContext();

        if (!(requestContext instanceof RequestContext)) {
            return undefined;
        }

        return requestContext.user;
    }
}
