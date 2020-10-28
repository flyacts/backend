/*!
 * @copyright FLYACTS GmbH 2019
 */

import { BaseError } from '@flyacts/backend';

/**
 * An error indicating that the configured meia action is
 * not available.
 */
export class MediaActionNotAvailableError extends BaseError {
    public constructor(
        public message: string,
    ) {
        super();
    }
}
