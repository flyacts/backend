/*!
 * @copyright FLYACTS GmbH 2019
 */

import { BaseEntity } from '@flyacts/backend-core-entities';
import {
    Column,
    Entity,
} from 'typeorm';

/**
 * An entity representing a roles´s permissions
 */
@Entity('permissions')
export class PermissionEntity extends BaseEntity {

    /**
     * The name of the permission.
     */
    @Column()
    public name!: string;
}
