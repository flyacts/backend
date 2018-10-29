/**
 * @copyright FLYACTS GmbH 2018
 */

import { BaseEntity } from '@flyacts/backend-core-entities';
import * as argon2 from 'argon2';
import { Exclude } from 'class-transformer';
import {
    IsBoolean,
    IsString,
    Length,
} from 'class-validator';
import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    Unique,
} from 'typeorm';

import { RoleEntity } from './role.entity';
import { TokenEntity } from './token.entity';

/**
 * Basic user entity
 */
@Entity('users')
@Unique(['username'])
@Unique(['email'])
export class UserEntity extends BaseEntity {

    /**
     * The username of the user
     */
    @Column({
        nullable: true,
        length: 60,
    })
    @Length(1, 60)
    @IsString()
    public username?: string;

    /**
     * Hashed password of the user
     */
    @Column({
        nullable: true,
        length: 255,
    })
    @Exclude()
    public password?: string;

    /**
     * Optional realm of the user (f.e. backoffice or frontend)
     */
    @Column({
        nullable: true,
        length: 20,
    })
    @Exclude()
    public realm?: string;

    /**
     * e-mail of the user
     */
    @Column()
    @Length(1, 60)
    @IsString()
    public email!: string;

    /**
     * Indicator if the user has verified his e-mail
     */
    @Column({
        name: 'email_verified',
        default: false,
    })
    @IsBoolean()
    public emailVerified: boolean = false;

    /**
     * Indiate if the user is disabled
     */
    @Column()
    @IsBoolean()
    public disabled: boolean = false;

    /**
     * The roles of a user.
     */
    @ManyToMany(
        () => RoleEntity,
        {
            eager: true,
            nullable: false,
        },
    )
    @JoinTable({
        name: 'user_roles',
        joinColumn: {
            name: 'users_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'roles_id',
            referencedColumnName: 'id',
        },
    })
    public roles!: RoleEntity[];

    /** The access tokens of a user */
    @OneToMany(
        () => TokenEntity,
        (token: TokenEntity) => token.user,
        {
            cascade: [
                'remove',
            ],
        },
    )
    public tokens!: TokenEntity[];

    /**
     * Securly store the password with the argon2 algorithm
     *
     * https://en.wikipedia.org/wiki/Argon2
     */
    public async setPassword(plainPassword: string) {
        this.password = await argon2.hash(plainPassword);
    }

    /**
     * Verify the given plain password with the stored password
     */
    public async verifyPassword(plainPassword: string) {
        if (typeof this.password === 'string') {
            return argon2.verify(this.password, plainPassword);
        } else {
            return false;
        }
    }
}
