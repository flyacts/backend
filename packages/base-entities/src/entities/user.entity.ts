/**
 * @copyright FLYACTS GmbH 2018
 */

import {
    Entity,
    Column,
    JoinTable,
    ManyToMany,
    OneToMany,
} from 'typeorm';

import {
    BaseEntity,
    RoleEntity,
    TokenEntity,
} from '../entities';

/**
 * Basic user entity
 */
@Entity('users')
export class UserEntity extends BaseEntity {
    
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
    @Column({
        name: 'email_verified',
        default: false,
    })
    public emailVerified: boolean = false;

    @ManyToMany(
        _ => RoleEntity, {
            cascade: ['insert'],
            eager: true,
        },
    )
    @JoinTable({
        name: 'user_roles',
        joinColumn: {
            name: 'users',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'roles',
            referencedColumnName: 'id',
        },
    })
    public roles: RoleEntity[] = [];

    @OneToMany(
        _ => TokenEntity,
        (token: TokenEntity) => token.user,
        {
            cascade: ['remove'],
        },
    )
    public tokens: TokenEntity[] = [];
}
