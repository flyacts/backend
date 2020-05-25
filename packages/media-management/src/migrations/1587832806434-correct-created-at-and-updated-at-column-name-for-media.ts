/*!
 * @copyright FLYACTS GmbH 2019
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Run migration correct_created_at_and_updated_at_column_name_s
 */
export class CorrectCreatedAtAndUpdatedAtColumnNameForMedia1587832806434 implements MigrationInterface {
    /**
     * TypeORMs migration up
     */
    public async up(queryRunner: QueryRunner) {
        const query = await fs.readFile(
            path.resolve(
                __dirname,
                `${__filename.slice(0, __filename.length - 3)}.sql`,
            ),
            'utf-8',
        );
        await queryRunner.query(query);
    }

    /**
     * TypeORMs migration down
     */
    public async down(_queryRunner: QueryRunner) {
        throw new Error('Not Possible');
    }

}
