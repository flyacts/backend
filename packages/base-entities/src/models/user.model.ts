/**
 * @copyright FLYACTS GmbH 2018
 */

import {
    Column,
    Entity,
} from 'typeorm';

import { BaseModel } from '../models';

/**
 * Basic user entity
 */
@Entity()
export class UserEntity extends BaseModel {
    /**
     * The username of the user
     */
    @Column({
        nullable: true,
    })
    public username?: string;

    /**
     * Hashed password of the user
     */
    @Column()
    public password!: string;

    /**
     * Optional realm of the user (f.e. backoffice or frontend)
     */
    @Column({
        nullable: true,
    })
    public realm?: string;

    /**
     * e-mail of the user
     */
    @Column()
    public email!: string;

    /**
     * Indicator if the user has verified his e-mail
     */
    @Column()
    public emailVerified: boolean = false;
}
