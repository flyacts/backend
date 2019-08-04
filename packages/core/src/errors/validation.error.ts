/*!
 * @copyright FLYACTS GmbH 2019
 */

import { BadRequestError } from '@flyacts/routing-controllers';
import { ValidationError as InnerValidationError } from 'class-validator';

/**
 * Will be thrown if class-validator failed to validate a class instance
 */
export class ValidationError extends BadRequestError {
    public id?: number;
    public errors: InnerValidationError[] = [];
}
