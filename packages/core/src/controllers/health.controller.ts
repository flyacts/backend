/*!
 * @copyright FLYACTS GmbH 2019
 */

import {
    Get,
    JsonController,
} from '@flyacts/routing-controllers';
import moment = require('moment');
import * as path from 'path';
import { Service } from 'typedi';
import { Connection } from 'typeorm';


/**
 * Controller for /
 */
@JsonController('/')
@Service()
export class HealthController {
    public startup: Date = new Date();

    public constructor(
        private connection: Connection,
    ) {}
    /**
     * returns certian health statistics
     */
    @Get()
    public async root() {
        return {
            health: 'ok',
            version: require(path.resolve(process.cwd(), 'ormconfig.json')).version,
            boot: moment(this.startup).toISOString(),
            uptime: (+(new Date()) - +(this.startup)) / 1000,
            migrations: (
                await this
                    .connection
                    .manager
                    .query('SELECT COUNT(*) FROM migrations')
            )[0].count,
        };
    }
}
