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
        _ => UserEntity,
        (user: UserEntity) => user.tokens,
        {
            nullable: false,
            cascade: ['insert'],
        },
    )
    public user!: UserEntity;
}
