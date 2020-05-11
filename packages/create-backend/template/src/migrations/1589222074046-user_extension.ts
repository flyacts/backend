/*!
 * @copyright FLYACTS GmbH 2018
 */

import {MigrationInterface, QueryRunner, Table} from 'typeorm';
// tslint:disable-next-line
import { TableColumnOptions } from 'typeorm/schema-builder/options/TableColumnOptions';

// tslint:disable:completed-docs

/**
 * The initial migrations
 */
export class UserExtension1589222074046 implements MigrationInterface {
    public async up(queryRunner: QueryRunner) {
        await queryRunner.query('CREATE SCHEMA user_management');

        const baseEntitySchema: TableColumnOptions[] = [
            {
                name: 'id',
                isPrimary: true,
                type: 'uuid',
                isGenerated: true,
                generationStrategy: 'uuid',
            },
            {
                name: 'created_at',
                type: 'timestamp',
                default: 'CURRENT_TIMESTAMP',
            },
            {
                name: 'updated_at',
                type: 'timestamp',
                default: 'CURRENT_TIMESTAMP',
            },
        ];

        const userExtension = new Table({
            name: 'user_management.user_extensions',
            columns: [
                ...baseEntitySchema,
                {
                    name: 'firstname',
                    type: 'text',
                },
                {
                    name: 'lastname',
                    type: 'text',
                },
                {
                    name: 'users_id',
                    type: 'uuid',
                },
            ],
            foreignKeys: [
                {
                    name: 'fk___user_extensions___users_id___users',
                    columnNames: ['users_id'],
                    referencedTableName: 'users',
                    referencedColumnNames: ['id'],
                },
            ],
        });

        await queryRunner.createTable(userExtension, true);
    }

    // tslint:disable-next-line:no-empty
    public async down() { }
}
