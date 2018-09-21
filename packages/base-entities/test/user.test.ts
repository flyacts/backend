/**
 * @copyright FLYACTS GmbH 2018
 */
// tslint:disable:no-hardcoded-credentials
// tslint:disable:newline-per-chained-call


import {
    Connection,
    Repository,
} from 'typeorm';

import {
    RoleEntity,
    UserEntity,
} from '../src/entities';

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

beforeAll(() => {
    testHandler = new TestHandler();
});

beforeEach(async () => {
    await testHandler.init();
    connection = testHandler.connection;
    userRepository = connection.getRepository(UserEntity);
    roleRepository = connection.getRepository(RoleEntity);
});

afterEach(async () => {
    await testHandler.finish();
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

        test('It should create a user with multiple roles', async () => {
            const role1Data = roleRepository.create({ name: 'role1' });
            const role2Data = roleRepository.create({ name: 'role2' });

            const role1 = await roleRepository.save(role1Data);
            const role2 = await roleRepository.save(role2Data);

            const user = userRepository.create({
                ...userData,
                roles: [role1, role2],
            });
            const { id } = await userRepository.save(user);

            const { roles: foundRoles } = await userRepository.findOne({ id }) as UserEntity;

            expect(foundRoles[0]).toHaveProperty('name', role1.name);
        });

    });

});
