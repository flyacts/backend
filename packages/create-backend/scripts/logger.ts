import * as chalk from 'chalk';
import { TransformableInfo } from 'logform';
import * as moment from 'moment';
import * as nodeEmoji from 'node-emoji';
import * as util from 'util';
import * as winston from 'winston';

function format(options: TransformableInfo) {
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
    return loglevel(`${symbol} [${_now}] [${options.level.toUpperCase()}] ${options.message} ${meta}`);
}

const logger = winston.createLogger({
            level: 'debug',
    transports: [
        new winston.transports.Console({
            format: winston.format.printf(info => format(info)),
        }),
    ],
});

export default logger;
