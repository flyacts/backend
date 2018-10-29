/*!
 * @copyright FLYACTS GmbH 2018
 */

import {MigrationInterface, QueryRunner, Table} from 'typeorm';
// tslint:disable-next-line
import { TableColumnOptions } from 'typeorm/schema-builder/options/TableColumnOptions';

/**
 * The initial migrations
 */
export class Init1537883700000 implements MigrationInterface {
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

        const users = new Table({
            name: 'users',
            uniques: [
                {
                    name: 'uq___users___username',
                    columnNames: ['username'],

                },
                {
                    name: 'uq___users___email',
                    columnNames: ['email'],
                },
            ],
            columns: [
                ...baseEntitySchema,
                {
                    name: 'username',
                    type: 'varchar',
                    length: '60',
                    isNullable: true,
                },
                {
                    name: 'password',
                    type: 'varchar',
                    length: '255',
                    isNullable: true,
                },
                {
                    name: 'realm',
                    type: 'varchar',
                    length: '40',
                },
                {
                    name: 'email',
                    type: 'varchar',
                    length: '60',
                },
                {
                    name: 'email_verified',
                    type: 'boolean',
                    default: false,
                },
                {
                    name: 'disabled',
                    type: 'boolean',
                    default: false,
                },
            ],
        });
        await queryRunner.createTable(users, true);

        const roles = new Table({
            name: 'roles',
            columns: [
                ...baseEntitySchema,
                {
                    name: 'name',
                    type: 'varchar',
                    length: '255',
                },
            ],
        });

        await queryRunner.createTable(roles, true);

        const userRoles = new Table({
            name: 'user_roles',
            columns: [
                {
                    name: 'users_id',
                    type: 'integer',
                },
                {
                    name: 'roles_id',
                    type: 'integer',
                },
            ],
            foreignKeys: [
                {
                    name: 'fk__user_roles__users_id',
                    columnNames: ['users_id'],
                    referencedTableName: 'users',
                    referencedColumnNames: ['id'],
                },
                {
                    name: 'fk__user_roles__roles_id',
                    columnNames: ['roles_id'],
                    referencedTableName: 'roles',
                    referencedColumnNames: ['id'],
                },
            ],
        });

        await queryRunner.createTable(userRoles, true);

        const tokens = new Table({
            name: 'tokens',
            columns: [
                ...baseEntitySchema,
                {
                    name: 'token',
                    type: 'varchar',
                    length: '128',
                },
                {
                    name: 'scopes',
                    type: 'varchar',
                },
                {
                    name: 'users_id',
                    type: 'integer',
                },
            ],
            foreignKeys: [
                {
                    name: 'fk__tokens__users_id',
                    columnNames: ['users_id'],
                    referencedTableName: 'users',
                    referencedColumnNames: ['id'],
                },
            ],
        });

        await queryRunner.createTable(tokens, true);
    }

    // tslint:disable-next-line:no-empty
    public async down() { }
}
