/*!
 * @copyright FLYACTS GmbH 2018
 */

import { Logger } from '@flyacts/backend';
import * as fs from 'fs-extra';
import * as yaml from 'js-yaml';
import * as path from 'path';

// tslint:disable-next-line
(async function() {
    const logger = new Logger();
    try {
        const doc = yaml.safeLoad(
            await fs.readFile(
                path.resolve(
                    __dirname,
                    `docker-compose.${process.env.environment}.yml`,
                ),
                'utf8',
            ),
        );

        doc.networks.flyacts_services.external = true;
        delete doc.networks.flyacts_services.ipam;
        delete doc.services.api.ports;

        const packageJson = require(path.resolve(__dirname, '../package.json'));

        doc.services.api.image = `backend:${packageJson.version}.${process.env.CI_PIPELINE_IID}`;

        await fs.writeFile(path.resolve(__dirname, '../docker-compose.yml'), yaml.safeDump(doc));

        process.exit(0);
    } catch (error) {
        logger.error('Failed to generate compose file', error);
        process.exit(1);
    }
})();
