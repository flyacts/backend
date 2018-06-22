/**
 * @copyright FLYACTS GmbH 2018
 */

export class ConnectionFailedError extends Error {
    public name = 'ConnectionFailedError';
    public constructor(
        public message: string,
        public stack: string | undefined,
    ) {
        super(message);
    }
}
