/*!
 * @copyright FLYACTS GmbH 2019
 */

import * as cls from 'cls-hooked';

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
        const namespace = RequestContext.obtainNamespace();
        return namespace.get(RequestContext.name);
    }

    /**
     * Checks if the namespace exists, if not creates it, either way returns it
     */
    public static obtainNamespace(): cls.Namespace {
        const ns = cls.getNamespace(RequestContext.nsid);

        // tslint:disable-next-line:strict-type-predicates
        if (typeof ns === 'undefined') {
            return cls.createNamespace(RequestContext.nsid);
        } else {
            return ns;
        }
    }
}
