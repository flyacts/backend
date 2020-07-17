/*!
 * @copyright FLYACTS GmbH 2019
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Run migration change_id_to_uuids
 */
export class ChangeCreatedByAndUpdatedByIDToUUIDForJobRunner1587836774946 implements MigrationInterface {
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
