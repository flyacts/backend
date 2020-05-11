/*!
 * @copyright FLYACTS GmbH 2018
 */

import { MigrationInterface, QueryRunner } from 'typeorm';

// tslint:disable:completed-docs

/**
 * Democontent from migrations
 */
export class UserRoles1589222074047 implements MigrationInterface {

    public async up(queryRunner: QueryRunner) {
        const roles = [
            'admin',
            'user',
        ];

        for (const role of roles) {
            await queryRunner.query('INSERT INTO public.roles(name) VALUES($1)', [
                role,
            ]);
        }
    }

    // tslint:disable-next-line:no-empty
    public async down() { }
}
