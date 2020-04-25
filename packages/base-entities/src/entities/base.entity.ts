/**
 * @copyright FLYACTS GmbH 2019
 */

import {
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { uuid } from '../types/uuid.type';

/**
 * Base entity that all other entities extend
 */
export abstract class BaseEntity {
    /**
     * Id of the entity
     */
    @PrimaryGeneratedColumn({
        type: 'uuid',
    })
    public id!: uuid;

    /**
     * When the entity was created
     */
    @CreateDateColumn({
        name: 'created_at',
    })
    public createdAt!: Date;

    /**
     * When the last time the entity was updated
     */
    @UpdateDateColumn({
        name: 'updated_at',
        nullable: true,
    })
    public updatedAt?: Date;
}
