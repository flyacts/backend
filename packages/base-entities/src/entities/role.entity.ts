/**
 * @copyright FLYACTS GmbH 2018
 */

import {
    Column,
    Entity,
} from 'typeorm';

import { BaseEntity } from './base.entity';

/**
 * An entity representing a user´s roles
 */
@Entity('roles')
export class RoleEntity extends BaseEntity {

    /**
     * The name of the role.
     */
    @Column()
    public name!: string;
}
