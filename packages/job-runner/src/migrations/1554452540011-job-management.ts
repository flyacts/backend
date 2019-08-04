/*!
 * @copyright FLYACTS GmbH 2018
 */

// tslint:disable:completed-docs no-submodule-imports

import {
    MigrationInterface,
    QueryRunner,
    Table,
} from 'typeorm';
import { TableColumnOptions } from 'typeorm/schema-builder/options/TableColumnOptions';

/**
 * Migration for the job management
 */
export class JobManagement1554452540011 implements MigrationInterface {

    public async up(queryRunner: QueryRunner) {
        const baseEntitySchema: TableColumnOptions[] = [
            {
                name: 'id',
                isPrimary: true,
                type: 'integer',
                isGenerated: true,
                generationStrategy: 'increment',
            },
            {
                name: 'createdAt',
                type: 'timestamp',
                default: 'CURRENT_TIMESTAMP',
            },
            {
                name: 'updatedAt',
                type: 'timestamp',
                default: 'CURRENT_TIMESTAMP',
            },
        ];

        const ownable: TableColumnOptions[] = [
            {
                name: 'created_by',
                type: 'integer',
                isNullable: true,
            },
            {
                name: 'updated_by',
                type: 'integer',
                isNullable: true,
            },
        ];

        const jobQueues = new Table({
            name: 'job_queues',
            columns: [
                ...baseEntitySchema,
                ...ownable,
                {
                    name: 'name',
                    type: 'varchar',
                    length: '100',
                    isUnique: true,
                },
            ],
        });

        await queryRunner.createTable(jobQueues);

        const jobs = new Table({
            name: 'jobs',
            columns: [
                ...baseEntitySchema,
                ...ownable,
                {
                    name: 'name',
                    type: 'varchar',
                    length: '100',
                },
                {
                    name: 'scheduled_at',
                    // TODO convert to timezone aware field
                    type: 'timestamp with time zone',
                    isNullable: true,
                },
                {
                    name: 'payload',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'result',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'status',
                    type: 'enum',
                    enum: [
                        'scheduled',
                        'running',
                        'success',
                        'failure',
                    ],
                },
                {
                    name: 'job_queue_id',
                    type: 'integer',
                },
            ],
            foreignKeys: [
                {
                    name: 'fk___jobs___job_queue',
                    columnNames: ['job_queue_id'],
                    referencedTableName: 'job_queues',
                    referencedColumnNames: ['id'],
                },
            ],
        });

        await queryRunner.createTable(jobs);
    }

    public async down(queryRunner: QueryRunner) {
        await queryRunner.dropTable('jobs');
        await queryRunner.dropTable('job_queues');
    }

}
