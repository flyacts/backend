/*!
 * @copyright FLYACTS GmbH 2018
 */

import { RequestContext } from '@flyacts/request-context';
import * as cls from 'cls-hooked';
import { Application } from 'express-serve-static-core';
import * as request from 'supertest';
import { Container } from 'typedi';
import { Connection, getConnectionManager } from 'typeorm';

// tslint:disable:no-any no-identical-functions one-variable-per-declaration no-hardcoded-credentials

/**
 * Setup the database in a way that it can be used by the test framework
 */
export async function setupDatabase(
    app: Application,
    connection: Connection,
) {
    const returnValue = {
        admin: undefined,
        user: undefined,
    };
    await connection.dropDatabase();

    const session = cls.createNamespace(RequestContext.nsid);
    const requestContext = new RequestContext();

    await session.runPromise(async () => {
        session.set(RequestContext.name, requestContext);
        await connection.runMigrations({
            transaction: 'each',
        });
    });

    let response = await request(app)
        .post('/users/login')
        .send({
            username: 'admin@test.test',
            password: '123456',
            realm: 'backoffice',
        })
        .expect(200);
    returnValue.admin = response.body;

    response = await request(app)
        .post('/users/login')
        .send({
            username: 'user@test.test',
            password: '123456',
            realm: 'frontend',
        })
        .expect(200);

    returnValue.user = response.body;

    return returnValue;
}

/**
 * Closes testing connections if they are connected.
 */
export async function closeTestingConnections() {
    const manager = getConnectionManager();
    for (const connection of manager.connections) {
        await connection.close();
    }
    Container.reset();
}
