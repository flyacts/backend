/**
 * @copyright FLYACTS GmbH 2018
 */

import {
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

/**
 * Basemodel for all other entities
 */
export abstract class BaseEntity {

    /**
     * Id of the entity
     */
    @PrimaryGeneratedColumn()
    public id!: number;

    /**
     * When the entity was created
     */
    @CreateDateColumn()
    public createdAt!: Date;

    /**
     * When the last time the entity was updated
     */
    @UpdateDateColumn()
    public updatedAt?: Date;
}
