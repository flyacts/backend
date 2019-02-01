/**
 * @copyright FLYACTS GmbH 2019
 */

import { BaseEntity } from '@flyacts/backend-core-entities';
import {
    IsBoolean,
    IsString,
    ValidateNested,
} from 'class-validator';

import { MediaVariantConfiguration } from './media-variant.configuration';

interface BaseEntityConstructor {
    new (): BaseEntity;
}

/**
 * A configuration of a media type
 */
export class MediaTypeConfiguration {
    /**
     * Defines for which entity this configuration is valid
     */
    public validForEntity: BaseEntityConstructor;

    /**
     * Defines for which collections this configuration is valid, undefined for all collections
     */
    public validForCollections?: string[];

    /**
     * The name of the configuration
     */
    @IsString()
    public name: string;

    /**
     * Indicate if the user can add multiple files for this media type
     */
    @IsBoolean()
    public multiple: boolean = false;

    /**
     * Indicate which mime types are allowed for this
     */
    @IsString({
        each: true,
    })
    public alllowedMimeTypes: string[] = [];

    /**
     * Variants of the media, fe small, regular, huge etc
     */
    @ValidateNested({
        each: true,
    })
    public variants: MediaVariantConfiguration[] = [];

    public constructor(name: string, validForEntity: BaseEntityConstructor) {
        this.name = name;
        this.validForEntity = validForEntity;
    }
}
