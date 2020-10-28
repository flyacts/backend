
/**
 * @copyright FLYACTS GmbH 2019
 */

import {
    IsDefined,
    IsString,
} from 'class-validator';

import { MediaActionOptions } from './media-action.options';

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
    public options: MediaActionOptions;

    public constructor(type: string, options: MediaActionOptions) {
        this.type = type;
        this.options = options;
    }
}
