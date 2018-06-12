/**
 * @copyright FLYACTS GmbH 2018
 */

import * as path from 'path';
import * as rimraf from 'rimraf';
import {
    Connection,
    ConnectionOptions,
    createConnection,
} from 'typeorm';

export class TestHandler {

    private _connection: Connection;
    private static DB_DIR = path.join(__dirname, '..', 'data');
    private static ENTITIES_PATH = path.join(__dirname, '..', '..', '..', 'src', 'entities', '*.entity.ts');
    private static CONNECTION_OPTIONS: ConnectionOptions = {
        database: TestHandler.DB_DIR,
        synchronize: true,
        type: 'sqlite',
        entities: [TestHandler.ENTITIES_PATH],
    };

    public constructor(
        private dbName,
    ) {}

    public async init(): Promise<void> {
        this._connection = await createConnection(TestHandler.CONNECTION_OPTIONS);
    }

    public async finish(): Promise<void> {
        const dbPath = path.join(TestHandler.DB_DIR, `${this.dbName}.db`);
        console.log(dbPath);
        await this._connection.close();
        rimraf.sync(dbPath);
    }

    public get connection(): Connection {
        return this._connection;
    }
}
