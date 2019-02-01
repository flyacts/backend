/*!
 * @copyright FLYACTS GmbH 2019
 */

import { BaseEntity } from '@flyacts/backend-core-entities';
import { OwnableEntity } from '@flyacts/backend-user-management';
import {
    IsNumber,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';
import {
    Column,
    OneToMany,
} from 'typeorm';

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
    )
    public files?: FileEntity[];

}
