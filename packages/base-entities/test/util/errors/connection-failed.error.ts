/**
 * @copyright FLYACTS GmbH 2018
 */

 /**
  * An error indicating that the DB connection has failed
  */
export class ConnectionFailedError extends Error {
    /** the name of the error */
    public name = 'ConnectionFailedError';
    public constructor(
        public message: string,
        public stack: string | undefined,
    ) {
        super(message);
    }
}
