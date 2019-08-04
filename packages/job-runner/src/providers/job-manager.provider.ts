/*!
 * @copyright FLYACTS GmbH 2018
 */

import {
    Logger,
    ValidationError,
} from '@flyacts/backend';
import { validate } from 'class-validator';
import serializeError = require('serialize-error');
import { Service } from 'typedi';
import { Connection } from 'typeorm';

import {
    JobQueueCallback,
    JobQueueEntity,
} from '../entities/job-queue.entity';
import { JobEntity } from '../entities/job.entity';
import { JobStatus } from '../enums/job-status.enum';


/**
 * Manage the job runner
 */
@Service()
export class JobManager {
    private queues: JobQueueEntity[] = [];
    private static readonly runnerRepeatInterval = 5 * 1000;

    public constructor(
        public connection: Connection,
        public logger: Logger,
    ) { }

    /**
     * Register a job queue in the system
     */
    public async registerJobQueue(name: string, callback: JobQueueCallback) {
        let jobQueue = await this.connection.manager.findOne(JobQueueEntity, {
            where: {
                name,
            },
        });

        if (!(jobQueue instanceof JobQueueEntity)) {
            jobQueue = new JobQueueEntity();
            jobQueue.name = name;
            await this.connection.manager.save(jobQueue);
        }

        jobQueue.callback = callback;

        if (!(this.queues.includes(jobQueue))) {
            this.queues.push(jobQueue);
        }
    }

    /**
     * Add a job to the system
     */
    public async addJob(job: JobEntity) {
        const errors = await validate(job);

        if (errors.length > 0) {
            const validationError = new ValidationError();
            validationError.errors = errors;
            throw validationError;
        }

        await this.connection.manager.save(job);
    }

    /**
     * Fetch a queue by name
     */
    public getQueue(name: string) {
        for (const queue of this.queues) {
            if (queue.name === name) {
                return queue;
            }
        }

        return undefined;
    }

    /**
     * Run all the queues
     */
    public async runQueues() {
        for (const queue of this.queues) {
            if (typeof queue.callback === 'undefined') {
                this.logger.error(`Queue ${queue.name} (ID: ${queue.id}) has no callback`);
                continue;
            }
            await this.runQueue(queue);
        }
        setTimeout(this.runQueues.bind(this), JobManager.runnerRepeatInterval);
    }

    /**
     * Run a specific queue
     */
    public async runQueue(queue: JobQueueEntity) {
        const jobs = await this
            .connection
            .getRepository(JobEntity)
            .createQueryBuilder('jobs')
            .where('job_queue_id = :jobQueueId', { jobQueueId: queue.id })
            .andWhere('status = :jobStatus', { jobStatus: JobStatus.Scheduled })
            .andWhere('((scheduled_at IS NULL) OR (scheduled_at < CURRENT_TIMESTAMP))')
            .getMany();

        if (jobs.length === 0) {
            return;
        }

        for (const job of jobs) {
            if (typeof queue.callback === 'undefined') {
                continue;
            }
            try {
                job.status = JobStatus.Running;
                await this.connection.manager.save(job);
                this.logger.debug(`Starting job for queue ${queue.name}`);
                const result = await queue.callback(job.payload);
                this.logger.debug(`Finished job for queue ${queue.name}`);

                if (typeof result === 'string') {
                    job.result = result;
                }

                job.status = JobStatus.Success;

                await this.connection.manager.save(job);
            } catch (error) {
                this.logger.error('Failed to run job', serializeError(error));

                job.status = JobStatus.Failure;

                if (typeof error === 'string') {
                    job.result = error;
                } else if ((typeof error === 'object') && (error.stack)) {
                    job.result = JSON.stringify(serializeError(error), undefined, 4);
                }

                await this.connection.manager.save(job);
            }
        }
    }
}
