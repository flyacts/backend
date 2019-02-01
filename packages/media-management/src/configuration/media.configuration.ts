/**
 * @copyright FLYACTS GmbH 2019
 */

import { IsString, ValidateNested } from 'class-validator';
import { Service } from 'typedi';

import { MediaTypeConfiguration } from './media-type.configuration';

/**
 * Configuration for all media
 */
@Service()
export class MediaConfiguration {
    /**
     * Where the files are going to be found
     */
    @IsString()
    public location: string;

    /**
     * Configured media types
     */
    @ValidateNested({
        each: true,
    })
    public types: MediaTypeConfiguration[] = [];

    public constructor(location: string) {
        this.location = location;
    }
}
