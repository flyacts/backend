/*!
 * @copyright FLYACTS GmbH 2018
 */

import { NullAble } from '@flyacts/backend';
import { BaseEntity } from '@flyacts/backend-core-entities';
import {
    IsString,
    Length,
} from 'class-validator';
import {
    Column,
    Entity,
} from 'typeorm';

export type JobQueueCallback = (payload: NullAble<string>) => Promise<string | void>;

/**
 * A queue for storing jobs
 */
@Entity('job_queues')
export class JobQueueEntity extends BaseEntity {
    @Column()
    @IsString()
    @Length(1, 100)
    public name!: string;

    public callback?: JobQueueCallback;
}
