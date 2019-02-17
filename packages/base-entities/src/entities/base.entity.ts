/**
 * @copyright FLYACTS GmbH 2019
 */

import {
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

/**
 * Base entity that all other entities extend
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
    @UpdateDateColumn({
        nullable: true,
    })
    public updatedAt?: Date;
}
