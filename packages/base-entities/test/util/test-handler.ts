/**
 * @copyright FLYACTS GmbH 2018
 */

import * as path from 'path';
import {
    Connection,
    ConnectionOptions,
    createConnection,
} from 'typeorm';

import { ConnectionFailedError } from './errors';

export class TestHandler {

    private _connection!: Connection;
    private static ENTITIES_PATH = path.join(__dirname, '..', '..', 'src', 'entities', '*.entity.ts');
    private static BASE_CONNECTION_OPTIONS: ConnectionOptions = {
        synchronize: true,
        type: 'sqlite',
        entities: [TestHandler.ENTITIES_PATH],
        database: ':memory:',
    };

    public async init(): Promise<void> {
        try {
            this._connection = await createConnection(TestHandler.BASE_CONNECTION_OPTIONS);
        }
        catch (err) {
            throw new ConnectionFailedError('TestHandler DB connection could not be estabishled', err.stack);
        }
    }

    public async finish(): Promise<void> {
        await this._connection.close();
    }

    public get connection(): Connection {
        return this._connection;
    }
}
