/*!
 * @copyright FLYACTS GmbH 2019
 */

import * as cls from 'cls-hooked';

import { NoActiveSessionError } from '../errors/no-active-session.error';

/**
 * An interface for cls-hooked
 */
export class RequestContext {

    /**
     * Payload that is attached to the current request context
     */
    public data?: unknown;
    /**
     * The id of the request context
     */
    public readonly id: number;

    /**
     * The namespace ID of the request context
     */
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
}
