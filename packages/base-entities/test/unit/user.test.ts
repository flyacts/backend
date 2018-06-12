/**
 * @copyright FLYACTS GmbH 2018
 */
// tslint:disable:newline-per-chained-call
// tslint:disable:no-hardcoded-credentials

import {
    Connection,
    Repository,
} from 'typeorm';

import {
    RoleEntity,
    UserEntity,
} from '../../src/entities';

import { TestHandler } from './util';

const userData = {
    email: 'test@test.test',
    username: 'Test',
    realm: 'frontend',
    password: 'aksjdlkadlaksjdalsk1n23m,213,m21n3,',
};

let testHandler: TestHandler;
let connection: Connection;
let userRepository: Repository<UserEntity>;
let roleRepository: Repository<RoleEntity>;

beforeAll(async () => {
    testHandler = new TestHandler('user_test');
});

beforeEach(async () => {
    await testHandler.init();
    connection = await testHandler.connection;
    userRepository = connection.getRepository(UserEntity);
    roleRepository = connection.getRepository(RoleEntity);
});

afterEach(async () => {
    await connection.close();
});

describe('User', async () => {

    describe('CREATE', async () => {
        test('It should create a single user', async () => {
            const user = userRepository.create(userData);
            const createdUser = await userRepository.save(user);

            const foundUser = await userRepository.findOne({ id: createdUser.id });

            expect(foundUser).toHaveProperty('email', 'test@test.test');
        });
    });

    describe('User with Roles', async () => {
        describe('CREATE', async () => {
            test('It should create a user with roles', async () => {
                const role = roleRepository.create({
                    name: 'usertest',
                });
                await roleRepository.save(role);
                const user = userRepository.create({
                    ...userData,
                    roles: [role],
                });
                const createdUser = await userRepository.save(user);

                const { roles: foundRoles } = await userRepository.findOne({ id: createdUser.id });

                expect(foundRoles[0]).toHaveProperty('name', 'admin');
            });
        });
    });

});
