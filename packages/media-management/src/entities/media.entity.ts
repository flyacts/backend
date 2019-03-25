/*!
 * @copyright FLYACTS GmbH 2019
 */

import { BaseEntity } from '@flyacts/backend-core-entities';
import { OwnableEntity } from '@flyacts/backend-user-management';
import { Expose } from 'class-transformer';
import {
    IsInt,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';
import {
    Column,
    OneToMany,
} from 'typeorm';

import { FileUploadProvider } from '../providers/file-upload.provider';

import { FileEntity } from './file.entity';

/**
 * An entity representing a user´s roles
 */
@OwnableEntity('media')
export class MediaEntity extends BaseEntity {
    /**
     * The related model as string
     */
    @Column()
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    public model!: string;

    /**
     * The id of the related model
     */
    @Column({
        name: 'model_id',
    })
    @IsNumber()
    public modelId!: number;

    /**
     * The name of a collection
     */
    @Column()
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    public collection!: string;

    /**
     * An optional name of the media
     */
    @Column()
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    @IsOptional()
    public name?: string;

    /**
     * Files of a media
     */
    @OneToMany(
        () => FileEntity,
        (file: FileEntity) => file.media,
        {
            eager: true,
        },
    )
    public files!: FileEntity[];

    /**
     * The sort order of the media inside the collection
     */
    @Column({
        name: 'sort_order',
        nullable: true,
    })
    @IsInt()
    @IsPositive()
    public sortOrder?: number;

    /**
     * The original uploaded file
     */
    @Expose()
    public get rawFile() {
        if (!Array.isArray(this.files)) {
            return;
        }

        for (const file of this.files) {
            if (file.variant === FileUploadProvider.rawVariant) {
                return file;
            }
        }
    }

}
