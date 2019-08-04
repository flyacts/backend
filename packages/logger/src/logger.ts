/*!
 * @copyright FLYACTS GmbH 2018
 */

import * as chalk from 'chalk';
import { TransformableInfo } from 'logform';
import * as moment from 'moment';
import * as nodeEmoji from 'node-emoji';
import * as path from 'path';
import * as util from 'util';
import * as winston from 'winston';

/**
 * A logger for backend projects
 */
export class Logger {
    private interalLogger: winston.Logger;
    private lastFilename: string = '';

    public constructor(logLevel: string = 'debug') {
        this.interalLogger = winston.createLogger({
            level: logLevel,
            transports: [
                new winston.transports.Console({
                    format: winston.format.printf(info => this.format(info)),
                }),
            ],
        });
    }

    /**
     * Log level error method
     */
    // tslint:disable-next-line:no-any
    public error(message: string, ...meta: any[]) {
        this.lastFilename = this.filename;
        return this.interalLogger.error(message, meta);
    }

    /**
     * Log level warn method
     */
    // tslint:disable-next-line:no-any
    public warn(message: string, ...meta: any[]) {
        this.lastFilename = this.filename;
        return this.interalLogger.warn(message, meta);
    }

    /**
     * Log level info method
     */
    // tslint:disable-next-line:no-any
    public info(message: string, ...meta: any[]) {
        this.lastFilename = this.filename;
        return this.interalLogger.info(message, meta);
    }

    /**
     * Log level debug method
     */
    // tslint:disable-next-line:no-any
    public debug(message: string, ...meta: any[]) {
        this.lastFilename = this.filename;
        return this.interalLogger.debug(message, meta);
    }

    private get filename() {
        const _ = Error.prepareStackTrace;
        Error.prepareStackTrace = (_error, _stack) => _stack;
        const error = new Error();
        const stack = (error.stack as unknown) as NodeJS.CallSite[];
        Error.prepareStackTrace = _;

        const callers = stack.map(x => x.getFileName());

        const firstExternalFilePath = callers.find(x => {
            return x !== callers[0];
        });

        return typeof firstExternalFilePath === 'string' ? path.basename(firstExternalFilePath) : 'anonymous';
    }

    /**
     * fancy format the log messages
     */
    private format(options: TransformableInfo) {
        let meta;
        const _now = moment().toISOString();
        let loglevel = chalk.default.reset;
        let symbol = '☼';

        if (options.level === 'debug') {
            symbol = nodeEmoji.get('bug');
            loglevel = chalk.default.cyan;
        } else if (options.level === 'info') {
            symbol = nodeEmoji.get('speech_balloon');
            loglevel = chalk.default.blue;
        } else if (options.level === 'warn') {
            symbol = nodeEmoji.get('warning');
            loglevel = chalk.default.yellow;
        } else if (options.level === 'error') {
            symbol = nodeEmoji.get('fire');
            loglevel = chalk.default.red;
        }

        if (typeof options['0'] === 'object' && Object.keys(options['0']).length > 0) {
            meta = '\n' + util.inspect(options['0'], {
                colors: true,
                depth: 5,
            });
        } else {
            meta = '';
        }

        // tslint:disable-next-line:max-line-length
        return loglevel(`${symbol} [${_now}] [${options.level.toUpperCase()}] [${this.lastFilename}] ${options.message} ${meta}`);
    }
}
