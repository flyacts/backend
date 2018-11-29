/*!
 * @copyright FLYACTS GmbH 2018
 */

import { RoleEntity, UserEntity } from '@flyacts/backend-user-management';
import * as faker from 'faker';
import { MigrationInterface, QueryRunner } from 'typeorm';

import { UserExtensionEntity } from '../entities/user-extension.entity';

/**
 * Democontent from migrations
 */
export class DemoContent1537885020000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner) {
        if (!(typeof process.env.USE_DEMOCONTENT === 'undefined')) {
            // tslint:disable-next-line:no-any
            const xfaker: any = faker;
            xfaker.locale = 'de';

            const roles = await queryRunner.manager.find(RoleEntity);

            let user = new UserEntity();
            user.username = 'admin@test.test';
            user.email = 'admin@test.test';
            user.emailVerified = true;
            user.realm = 'backoffice';
            await user.setPassword('123456');
            user.roles = roles.filter(role => role.name === 'admin');
            await queryRunner.connection.manager.save(user);

            let userExtension = new UserExtensionEntity();
            userExtension.firstname = 'Admin';
            userExtension.lastname = 'Admin';
            userExtension.user = user;
            await queryRunner.connection.manager.save(userExtension);

            user = new UserEntity();
            user.username = 'user@test.test';
            user.email = 'user@test.test';
            user.emailVerified = true;
            user.realm = 'backoffice';
            await user.setPassword('123456');
            user.roles = roles.filter(role => role.name === 'user');
            await queryRunner.connection.manager.save(user);

            userExtension = new UserExtensionEntity();
            userExtension.firstname = 'User';
            userExtension.lastname = 'USer';
            userExtension.user = user;
            await queryRunner.connection.manager.save(userExtension);
        }
    }

    // tslint:disable-next-line:no-empty
    public async down() { }

}
