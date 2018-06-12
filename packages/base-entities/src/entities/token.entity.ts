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
    @Column()
    public value!: string;

    @Column({
        nullable: false,
        type: 'simple-array',
    })
    public scopes!: string[];

    @ManyToOne(
        _ => UserEntity,
        (user: UserEntity) => user.tokens,
    )
    public user!: UserEntity;
}
