/**
 * @copyright FLYACTS GmbH 2018
 */

import { BaseEntity } from '@flyacts/backend-core-entities';
import {
    Column,
    Entity,
} from 'typeorm';

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
