/**
 * @copyright FLYACTS GmbH 2018
 */
// tslint:disable:no-hardcoded-credentials
// tslint:disable:newline-per-chained-call

import {
    Connection,
    EntityManager,
} from 'typeorm';

import {
    TokenEntity, UserEntity,
} from '../src/entities';

import { TestHandler } from './util';

let connection: Connection;
let manager: EntityManager;
let testHandler: TestHandler;

beforeAll(async () => {
    testHandler = new TestHandler();
});

beforeEach(async () => {
    await testHandler.init();
    connection = testHandler.connection;
    manager = connection.manager;
});

afterEach(async () => {
    await testHandler.finish();
});

describe('TokenEntity', async () => {
    test('It should create a token associated with a user', async () => {

        const user = await manager.create<UserEntity>(UserEntity, {
            email: 'test@test.test',
            password: '123456',
        });

        const token = await manager.create<TokenEntity>(TokenEntity, {
            value: 'test"(§")(§)"§(")(§"§',
            scopes: ['*'],
            user,
        });
        await manager.save(token);

        const tokens = await manager.find<TokenEntity>(TokenEntity);

        expect(tokens.length).toEqual(1);
        expect(tokens[0]).toHaveProperty('value', 'test"(§")(§)"§(")(§"§');
    });
});
