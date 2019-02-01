
/**
 * @copyright FLYACTS GmbH 2019
 */

import {
    IsDefined,
    IsString,
} from 'class-validator';

/**
 * A media action configuration
 */
export class MediaActionConfiguration {
    /**
     * The type of the action, fe resize, crop etc
     */
    @IsString()
    public type: string;

    /**
     * Options for the action
     */
    @IsDefined()
    public options: unknown;

    public constructor(type: string, options: unknown) {
        this.type = type;
        this.options = options;
    }
}
