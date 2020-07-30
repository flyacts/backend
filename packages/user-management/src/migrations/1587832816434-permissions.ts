/*!
 * @copyright FLYACTS GmbH 2019
 */

// tslint:disable:completed-docs

import {MigrationInterface, QueryRunner, Table} from 'typeorm';
// tslint:disable-next-line
import { TableColumnOptions } from 'typeorm/schema-builder/options/TableColumnOptions';

/**
 * Add permissions
 */
export class Permissions1587832816434 implements MigrationInterface {
    public async up(queryRunner: QueryRunner) {
        const baseEntitySchema: TableColumnOptions[] = [
            {
                name: 'id',
                isPrimary: true,
                type: 'uuid',
                isGenerated: true,
                generationStrategy: 'increment',
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

        const permissions = new Table({
            name: 'permissions',
            columns: [
                ...baseEntitySchema,
                {
                    name: 'name',
                    type: 'varchar',
                    isNullable: false,
                },
            ],
        });

        await queryRunner.createTable(permissions, true);

        const rolePermissions = new Table({
            name: 'role_permissions',
            columns: [
                ...baseEntitySchema,
                {
                    name: 'role_id',
                    type: 'uuid',
                    isNullable: false,
                },
                {
                    name: 'permission_id',
                    type: 'uuid',
                    isNullable: false,
                },
            ],
            foreignKeys: [
                {
                    name: 'fk__role',
                    columnNames: ['role_id'],
                    referencedTableName: 'roles',
                    referencedColumnNames: ['id'],
                },
                {
                    name: 'fk__permission',
                    columnNames: ['permission_id'],
                    referencedTableName: 'permissions',
                    referencedColumnNames: ['id'],
                },
            ],
        });

        await queryRunner.createTable(rolePermissions, true);
    }

    // tslint:disable-next-line:no-empty
    public async down() { }
}
