/**
 * @copyright FLYACTS GmbH 2018
 */

import {
    Column,
    Entity,
} from 'typeorm';

import { BaseEntity } from './base.entity';

@Entity('roles')
export class RoleEntity extends BaseEntity {
    @Column()
    public name!: string;
}
