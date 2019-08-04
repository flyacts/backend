/*!
 * @copyright FLYACTS GmbH 2018
 */

import { NullAble } from '@flyacts/backend';
import { BaseEntity } from '@flyacts/backend-core-entities';
import { OwnableEntity } from '@flyacts/backend-user-management';
import {
    IsDate,
    IsEnum,
    IsOptional,
    IsString,
    Length,
} from 'class-validator';
import {
    Column,
    JoinColumn,
    ManyToOne,
} from 'typeorm';

import { JobStatus } from '../enums/job-status.enum';

import { JobQueueEntity } from './job-queue.entity';

/**
 * Definition of a job
 */
@OwnableEntity('jobs')
export class JobEntity extends BaseEntity {
    @Column()
    @IsString()
    @Length(1, 60)
    public name!: string;

    @Column({
        name: 'scheduled_at',
        nullable: true,
        type: Date,
    })
    @IsDate()
    @IsOptional()
    public scheduledAt?: NullAble<Date> = null;

    @Column({
        nullable: true,
        type: 'text',
    })
    @IsString()
    @IsOptional()
    public payload: NullAble<string> = null;

    @Column({
        nullable: true,
        type: 'text',
    })
    @IsString()
    @IsOptional()
    public result?: NullAble<string> = null;

    @Column()
    @IsEnum(JobStatus)
    public status: JobStatus = JobStatus.Scheduled;

    @ManyToOne(
        () => JobQueueEntity,
    )
    @JoinColumn({
        name: 'job_queue_id',
    })
    public queue!: JobQueueEntity;
}
