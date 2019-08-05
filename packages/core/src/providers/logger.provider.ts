/*!
 * @copyright FLYACTS GmbH 2018
 */

import { Logger as InternalLogger } from '@flyacts/backend-logger';
import * as config from 'config';
import { Service } from 'typedi';
import * as _winston from 'winston';

/**
 * A logger for backend projects
 */
@Service()
export class Logger {
    public interalLogger: InternalLogger = new InternalLogger(config.get('logger.level'));

    public error = this.interalLogger.error.bind(this.interalLogger);
    public warn = this.interalLogger.warn.bind(this.interalLogger);
    public info = this.interalLogger.info.bind(this.interalLogger);
    public debug = this.interalLogger.debug.bind(this.interalLogger);
}
