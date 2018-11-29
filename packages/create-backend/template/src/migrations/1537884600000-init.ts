/*!
 * @copyright FLYACTS GmbH 2018
 */

import {MigrationInterface, QueryRunner, Table} from 'typeorm';
// tslint:disable-next-line
import { TableColumnOptions } from 'typeorm/schema-builder/options/TableColumnOptions';

/**
 * The initial migrations
 */
export class Init1537884600000 implements MigrationInterface {
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

        const userExtension = new Table({
            name: 'user_extensions',
            columns: [
                ...baseEntitySchema,
                {
                    name: 'firstname',
                    type: 'varchar',
                    length: '60',
                },
                {
                    name: 'lastname',
                    type: 'varchar',
                    length: '60',
                },
                {
                    name: 'users_id',
                    type: 'integer',
                },
            ],
            foreignKeys: [
                {
                    name: 'fk__user_extensions',
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
