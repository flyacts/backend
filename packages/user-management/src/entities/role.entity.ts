/*!
 * @copyright FLYACTS GmbH 2019
 */

import { BaseEntity } from '@flyacts/backend-core-entities';
import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
} from 'typeorm';

import { PermissionEntity } from './permission.entity';

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

    /**
     * The permissions of a role.
     */
    @ManyToMany(
        () => PermissionEntity,
        {
            eager: true,
            nullable: false,
        },
    )
    @JoinTable({
        name: 'role_permissions',
        joinColumn: {
            name: 'role_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'permission_id',
            referencedColumnName: 'id',
        },
    })
    public permissions!: PermissionEntity[];
}
