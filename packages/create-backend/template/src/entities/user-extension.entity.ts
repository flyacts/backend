/*!
 * @copyright FLYACTS GmbH 2018
 */


import {
    BaseEntity,
} from '@flyacts/backend-core-entities';
import { UserEntity } from '@flyacts/backend-user-management';
import {
    Type,
} from 'class-transformer';
import {
    IsString,
    Length,
    ValidateNested,
} from 'class-validator';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
} from 'typeorm';

/**
 * Extends the user with attributes
 */
@Entity('user_extensions')
export class UserExtensionEntity extends BaseEntity {
    @Column()
    @IsString()
    @Length(1, 60)
    public firstname!: string;

    @Column()
    @IsString()
    @Length(1, 60)
    public lastname!: string;

    @ManyToOne(
        () => UserEntity,
        {
            eager: true,
            cascade: ['remove'],

        },
    )
    @JoinColumn({
        name: 'users_id',
    })
    @ValidateNested()
    @Type(() => UserEntity)
    public user!: UserEntity;
}
