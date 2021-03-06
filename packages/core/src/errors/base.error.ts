/*!
 * @copyright FLYACTS GmbH 2018
 */

/**
 * A generic base class for all the errors
 */
export abstract class BaseError extends Error {
    public constructor() {
        super();
        this.name = this.constructor.name;
    }
}
