# Writing migrations

This project uses [typeorm](https://typeorm.io/#/) for all the database
abstraction, so also for the migrations.

At the beginng our aim was to be database agnostic, but the way the migrations
are written this is only possible to a certain degree.

So lets get started!

First we use typeorm to scaffold a migrations-File:

```bash
npm run typeorm -- migration:create --name 'example'
```

This results in this file:

```typescript
import {MigrationInterface, QueryRunner} from "typeorm";

export class example1552300296490 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
```

After fixing the linting issues we have this:

```typescript
/*!
 * @copyright FLYACTS GmbH 2018
 */

import { MigrationInterface, QueryRunner } from 'typeorm';

// tslint:disable:completed-docs

export class Example1552300296490 implements MigrationInterface {

    public async up(queryRunner: QueryRunner) {
    }

    // tslint:disable-next-line:no-empty
    public async down() {}

}
```

Now we can create our tables in the `up`-Method of the class.

For example if we want to create a table named examples it would look like this:

```typescript
/*!
 * @copyright FLYACTS GmbH 2018
 */

import {
    MigrationInterface,
    QueryRunner,
    Table,
} from 'typeorm';
// tslint:disable-next-line
import { TableColumnOptions } from 'typeorm/schema-builder/options/TableColumnOptions';

// tslint:disable:completed-docs

export class Example1552300296490 implements MigrationInterface {

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

        const example = new Table({
            name: 'examples',
            columns: [
                ...baseEntitySchema,
                ...ownable,
                {
                    name: 'display_name',
                    type: 'varchar',
                    length: '100',
                },
            ],
        });

        await queryRunner.createTable(example, true);
    }

    // tslint:disable-next-line:no-empty
    public async down() {}

}

```

To have `baseEntitySchema` and `ownable` here has the simple reason that these
definitions should be immutable and having these in a common file invites you to
change it and this would invalidate all your existing migrations.

Further reading: 

https://github.com/typeorm/typeorm/blob/master/docs/migrations.md#using-migration-api-to-write-migrations
