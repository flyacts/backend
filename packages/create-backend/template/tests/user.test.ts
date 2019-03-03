/*!
 * @copyright FLYACTS GmbH 2018
 */

 // tslint:disable-next-line:max-line-length
 // tslint:disable:no-any no-identical-functions one-variable-per-declaration no-big-function no-duplicate-string no-hardcoded-credentials

import { expect } from 'chai';
import { Application } from 'express';
import * as request from 'supertest';
import { Connection } from 'typeorm';

import {
    startApp,
} from '../src/server';

import { closeTestingConnections, setupDatabase } from './helper';


const isoRegEx = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;

describe('User Controller', () => {
    let app: Application;
    let connection: Connection;
    let admin: any, user: any;

    before(async () => {
        process.env.USE_DEMOCONTENT = 'yes';
        const result = await startApp();
        app = result.express;
        connection = result.connection;
    });

    after(async () => {
        await closeTestingConnections();
    });

    describe('login', () => {
        before(async () => {
            const users = await setupDatabase(app, connection);
            admin = users.admin;
            user = users.user;
        });

        it('should login an admin', async () => {
            await request(app).get('/').expect(200);

            const response = await request(app)
                .post('/users/login')
                .send({
                    username: 'admin@test.test',
                    password: '123456',
                    realm: 'backoffice',
                })
                .expect(200);

            const body = response.body;

            expect(body).to.be.an('object');

            expect(body).to.have.property('id', 3);
            expect(body.createdAt).to.match(isoRegEx);
            expect(body.updatedAt).to.match(isoRegEx);
            expect(body.token).to.be.a('string');
            expect(body.token).to.have.property('length', 44);
        });

        it('should login as a user', async () => {
            await request(app).get('/').expect(200);

            const response = await request(app)
                .post('/users/login')
                .send({
                    username: 'user@test.test',
                    password: '123456',
                    realm: 'frontend',
                })
                .expect(200);

            const body = response.body;

            expect(body).to.be.an('object');

            expect(body).to.have.property('id', 4);
            expect(body.createdAt).to.match(isoRegEx);
            expect(body.updatedAt).to.match(isoRegEx);
            expect(body.token).to.be.a('string');
            expect(body.token).to.have.property('length', 44);
        });

        it('should return all the users as an admin', async () => {
            const response = await request(app)
                .get('/users')
                .set({
                    Authorization: admin.token,
                })
                .expect(200);

            const body = response.body;

            expect(body).to.be.an('array');
        });

        it('should return all the users as an admin', async () => {
            await request(app)
                .get('/users')
                .set({
                    Authorization: user.token,
                })
                .expect(403);
        });

        it('should fail to login with invalid credentials', async () => {
            await request(app)
                .post('/users/login')
                .send({
                    username: 'invalid@test.test',
                    password: '123456',
                    realm: 'backoffice',
                })
                .expect(401);
        });
    });
});
