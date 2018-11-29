/*!
 * @copyright FLYACTS GmbH 2018
 */

import {
    Get,
    JsonController,
} from 'routing-controllers';
import { Service } from 'typedi';


/**
 * Controller for /
 */
@JsonController('/')
@Service()
export class HealthController {
    /**
     * returns certian health statistics
     */
    @Get()
    public root() {
        return {
            'health': 'ok',
        };
    }
}
