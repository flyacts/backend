/**
 * @copyright FLYACTS GmbH 2019
 */

import {
    IsInt,
    IsString,
    ValidateNested,
} from 'class-validator';

import { MediaActionConfiguration } from './media-action.configuration';

/**
 * Configure variants for a media type, fe thumbnail, small, big, regular etc
 */
export class MediaVariantConfiguration {
    /**
     * Name of the media variant
     */
    @IsString()
    public name: string;

    /**
     * The quality of the final rendered image
     */
    @IsInt()
    public outputQuality: number;

    /**
     * Actions for this variant, fe for resize etc
     */
    @ValidateNested({
        each: true,
    })
    public actions: MediaActionConfiguration[] = [];


    public constructor(name: string, outputQuality: number) {
        this.name = name;
        this.outputQuality = outputQuality;
    }
}
