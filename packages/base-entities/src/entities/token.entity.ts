/**
 * @copyright FLYACTS GmbH 2018
 */

import {
    Column,
    Entity,
    ManyToOne,
} from 'typeorm';

import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';

/**
 * An entity representing a user`s tokens
 */
@Entity('tokens')
export class TokenEntity extends BaseEntity {

    /**
     * The access token itself.
     */
    @Column()
    public value!: string;

    /**
     * The scopes of the token.
     */
    @Column({
        type: 'simple-array',
        nullable: false,
    })
    public scopes!: string[];

    /**
     * The user the access token belongs to.
     */
    @ManyToOne(
        () => UserEntity,
        (user: UserEntity) => user.tokens,
        {
            nullable: false,
            cascade: ['insert'],
            eager: true,
        },
    )
    public user!: UserEntity;
}
