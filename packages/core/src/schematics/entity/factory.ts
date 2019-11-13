/*!
 * @copyright FLYACTS GmbH 2019
 */

import { strings } from '@angular-devkit/core';
import {
    apply,
    applyTemplates,
    mergeWith,
    Rule,
    SchematicContext,
    Tree,
    url,
} from '@angular-devkit/schematics';
import moment = require('moment');
const pluralize = require('pluralize');

export interface OptionSchema {
    name: string;
}

/**
 * Scaffold the entity
 */
// tslint:disable-next-line:no-default-export
export default function(options: OptionSchema): Rule {
    return (_tree: Tree, _context: SchematicContext) => {
        const now = moment();
        const source = apply(url('./files'), [
            applyTemplates({
                ...options,
                ...strings,
                pluralize,
                timestamp: +(now.toDate()),
                now,
            }),
        ]);
        return mergeWith(source);
    };
}
