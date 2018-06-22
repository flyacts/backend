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

/**
 * A utility class handling test setup and teardown.
 */
export class TestHandler {

    /** the DB connection */
    private _connection!: Connection;
    /** the path to the TypeORM entities   */
    private static ENTITIES_PATH = path.join(__dirname, '..', '..', 'src', 'entities', '*.entity.ts');
    /** the DB connection options */
    private static BASE_CONNECTION_OPTIONS: ConnectionOptions = {
        synchronize: true,
        type: 'sqlite',
        entities: [TestHandler.ENTITIES_PATH],
        database: ':memory:',
    };

    /**
     * Sets up a connection using the connection options
     */
    public async init(): Promise<void> {
        try {
            this._connection = await createConnection(TestHandler.BASE_CONNECTION_OPTIONS);
        }
        catch (err) {
            throw new ConnectionFailedError('TestHandler DB connection could not be estabishled', err.stack);
        }
    }

    /**
     * Closes the current connection
     */
    public async finish(): Promise<void> {
        await this._connection.close();
    }

    /**
     * A getter for the connection
     */
    public get connection(): Connection {
        return this._connection;
    }
}
