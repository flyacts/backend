import * as request from 'supertest';
import { Connection } from 'typeorm';

import { Application } from "express-serve-static-core";

export async function setupDatabase(
    app: Application,
    connection: Connection,
) {
    let returnValue = {
        admin: undefined,
        user: undefined,
    }
    await connection.dropDatabase();
    await connection.runMigrations();

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
            realm: 'backoffice',
        })
        .expect(200);

    returnValue.user = response.body;

    return returnValue;
}
