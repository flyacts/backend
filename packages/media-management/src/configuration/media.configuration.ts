/**
 * @copyright FLYACTS GmbH 2019
 */

import {
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';
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
     * Lets you specify the tempdir for the blobstore
     *
     * This is needed because in most docker environments the `tempDir` is not
     * on the same device as `location` and
     */
    @IsString()
    @IsOptional()
    public tempDir?: string;

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
