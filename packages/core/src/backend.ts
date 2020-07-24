/*!
 * @copyright FLYACTS GmbH 2018
 */

// tslint:disable-next-line
import {
    createAuthorizationCheck,
    createCurrentUserChecker,
} from '@flyacts/backend-user-management';
import {
    Action,
    createExpressServer,
    getMetadataArgsStorage,
    useContainer as rcUseContainer,
} from '@flyacts/routing-controllers';
import { routingControllersToSpec } from '@flyacts/routing-controllers-openapi';
import {
    getFromContainer,
    MetadataStorage,
} from 'class-validator';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import * as config from 'config';
import { CorsOptions } from 'cors';
import { Application } from 'express';
import {
    Container,
} from 'typedi';
import {
    Connection,
    ConnectionOptions,
    createConnection,
    useContainer as ormUseContainer,
} from 'typeorm';

import { VersionInformation } from './interfaces/version-information.interface';
import { Logger } from './providers/logger.provider';

const swaggerUi = require('swagger-ui-express');

/**
 * A generic initializer of our backend
 */
export class Backend {
    public connection!: Connection;
    public express!: Application;
    public logger!: Logger;

    private controllers: Function[] = [];
    private versionInformation: VersionInformation;

    private constructor(
        versionInformation: VersionInformation,
    ) {
        this.versionInformation = versionInformation;
    }

    /**
     * Launch the listen port and optional explorer
     */
    public async start() {
        if (config.get('explorer.enabled') === true) {
            // Parse class-validator classes into JSON Schema:
            // tslint:disable-next-line:no-any
            const metadatas = (getFromContainer(MetadataStorage) as any).validationMetadatas;
            const schemas = validationMetadatasToSchemas(metadatas, {
                refPointerPrefix: '#/components/schemas',
            });


            // Parse routing-controllers classes into OpenAPI spec:
            const storage = getMetadataArgsStorage();
            const spec = routingControllersToSpec(storage, {
                controllers: this.controllers,
                defaultErrorHandler: true,
                development: true,
            }, {
                    components: {
                        schemas,
                        securitySchemes: {
                            ApiKeyAuth: {
                                type: 'apiKey',
                                in: 'header',
                                name: 'Authorization',
                            },
                        },
                    },
                    info: {
                        description: this.versionInformation.description,
                        title: this.versionInformation.name,
                        version: this.versionInformation.version,
                    },
                    security: [
                        {
                            ApiKeyAuth: [

                            ],
                        },
                    ],
                });

            this.express.use('/explorer', swaggerUi.serve, swaggerUi.setup(spec));
            this.logger.debug('Registered /explorer');
        }

        const listen: string = config.has('listen') ? config.get('listen') : 'localhost';
        const port: number = config.has('port') ? config.get('port') : 3000;

        this.express.listen(port, listen, () => {
            this.logger.info(`Serving on http://${listen}:${port}`);
        });

    }

    /**
     * Create a new backend instance and configure it
     */
    // tslint:disable-next-line:parameters-max-number
    public static async create(
        typeOrmConfig: ConnectionOptions | Connection,
        controllers: Function[],
        middlewares: Function[],
        versionInformation: VersionInformation,
        authorizationChecker?: (action: Action, roles: string[]) => Promise<boolean>,
        currentUserChecker?: (action: Action) => Promise<unknown>,
        development: boolean = true,
        cors: boolean | CorsOptions = true,
        validation: boolean = false,
        defaultErrorHandler: boolean = true,
    ) {
        const be = new Backend(versionInformation);
        if (typeOrmConfig instanceof Connection) {
            be.connection = typeOrmConfig;
        } else {
            be.connection = await createConnection(typeOrmConfig);
        }

        Container.set(Connection, be.connection);
        Container.set('connection', be.connection);
        be.logger = Container.get(Logger);

        rcUseContainer(Container);
        ormUseContainer(Container);

        be.express = createExpressServer({
            authorizationChecker: typeof authorizationChecker === 'undefined' ?
                createAuthorizationCheck(be.connection) :
                authorizationChecker,
            currentUserChecker: typeof currentUserChecker === 'undefined' ?
                createCurrentUserChecker(be.connection) :
                currentUserChecker,
            controllers,
            middlewares,
            defaultErrorHandler,
            validation,
            development,
            cors,
        });

        return be;
    }
}
