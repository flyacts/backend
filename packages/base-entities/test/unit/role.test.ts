/**
 * @copyright FLYACTS GmbH 2018
 */
// tslint:disable:newline-per-chained-call
// tslint:disable:no-hardcoded-credentials

import {
    Connection,
    EntityManager,
} from 'typeorm';

import {
    RoleEntity,
} from '../../src/entities';

import { TestHandler } from './util';

let connection: Connection;
let manager: EntityManager;
let testHandler: TestHandler;

beforeAll(async () => {
    testHandler = new TestHandler('role_test');
});

beforeEach(async () => {
    await testHandler.init();
    connection = await testHandler.connection;
    manager = connection.manager;
});

afterEach(async () => {
    await testHandler.finish();
});

test('It should create and save a single role', async () => {
    const role = await manager.create<RoleEntity>(RoleEntity, {
        name: 'admin',
    });
    await manager.save(role);

    const roles = await manager.find<RoleEntity>(RoleEntity);
    console.log(roles);

    expect(roles[0]).toHaveProperty('name', 'admin');
});
