/*!
 * @copyright FLYACTS GmbH 2018
 */

import * as cls from 'cls-hooked';
// tslint:disable-next-line
import { RequestContext } from '@flyacts/request-context';
const session = cls.createNamespace(RequestContext.nsid);

// tslint:disable-next-line
import {
    createAuthorizationCheck,
    createCurrentUserChecker,
} from '@flyacts/backend-user-management';
import { MetadataStorage } from 'class-validator';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import * as config from 'config';
import { Application } from 'express';
import {
    createExpressServer,
    getMetadataArgsStorage,
    useContainer as rcUseContainer,
} from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import {
    Container,
} from 'typedi';
import {
    Connection,
    ConnectionOptions,
    createConnection,
    getFromContainer,
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
    public static async create(
        typeOrmConfig: ConnectionOptions,
        controllers: Function[],
        middlewares: Function[],
        versionInformation: VersionInformation,
    ) {
        return session.runPromise(async () => {
            session.set(RequestContext.name, new RequestContext());
            const be = new Backend(versionInformation);
            be.connection = await createConnection(typeOrmConfig);

            Container.set(Connection, be.connection);
            Container.set('connection', be.connection);
            be.logger = Container.get(Logger);

            rcUseContainer(Container);
            ormUseContainer(Container);

            be.express = createExpressServer({
                authorizationChecker: createAuthorizationCheck(be.connection),
                currentUserChecker: createCurrentUserChecker(be.connection),
                controllers,
                middlewares,
                defaultErrorHandler: true,
                development: true,
                cors: true,
            });

            return be;
        });
    }
}
