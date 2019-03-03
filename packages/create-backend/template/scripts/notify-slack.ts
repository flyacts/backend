/*!
 * @copyright FLYACTS GmbH 2018
 */

import { Logger } from '@flyacts/backend';
import fetch from 'cross-fetch';
import minimist = require('minimist');

// tslint:disable-next-line
(async function() {
    const logger = new Logger();
    try {
        const args = minimist((process.argv.slice(2)));
        const text = args['_'].join(' ');
        const channel = '';


        await fetch('', {
            method: 'post',
            body: JSON.stringify({
                icon_url: '',
                username: '',
                text,
                channel,
            }),
        });

        process.exit(0);
    } catch (error) {
        logger.error('Failed to notify Slack', error);
        process.exit(1);
    }
})();
