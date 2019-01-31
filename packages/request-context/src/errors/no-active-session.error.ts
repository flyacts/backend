/*!
 * @copyright FLYACTS GmbH 2019
 */

/**
 * Thrown if no cls session is active
 */
export class NoActiveSessionError extends Error {
    public constructor(message?: string) {
        super(message);
        this.name = this.constructor.name;
    }
}
