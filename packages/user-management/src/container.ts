/*!
 * @copyright FLYACTS GmbH 2018
 */

import { Container } from 'typedi';

/**
 * Import another container into this project
 */
// tslint:disable-next-line:no-any
export function useContainer(container: any) {
    for (const service of container.globalInstance.services) {
        Container.set(service);
    }
}
