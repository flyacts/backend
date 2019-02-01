/*!
 * @copyright FLYACTS GmbH 2019
 */

import { OwnableEntity } from '@flyacts/backend-user-management';
import { Type } from 'class-transformer';
import {
    IsNumber,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';
import {
    Column,
    JoinColumn,
    ManyToOne,
} from 'typeorm';

import { MediaEntity } from './media.entity';

/**
 * Represents a file of a a variant of a media
 */
@OwnableEntity('files')
export class FileEntity {
    /**
     * The linked media of the file
     */
    @ManyToOne(
        () => MediaEntity,
    )
    @JoinColumn({
        name: 'media_id',
    })
    @Type(() => MediaEntity)
    public media!: MediaEntity;

    /**
     * The variant of the media
     */
    @Column()
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    public variant!: string;

    /**
     * The content type of the variant
     */
    @Column({
        name: 'content_type',
    })
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    public contentType!: string;

    /**
     * The size of the file
     */
    @Column()
    @IsNumber()
    public size!: number;

    /**
     * The hash of the file, used for putting it in the file system
     */
    @Column()
    public hash!: string;
}
