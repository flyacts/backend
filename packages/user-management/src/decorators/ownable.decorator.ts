/*!
 * @copyright FLYACTS GmbH 2019
 */

import { RequestContext } from '@flyacts/backend';
import { EntityOptions, getMetadataArgsStorage } from 'typeorm';

import { UserManagementMetadata } from '../helpers/user-management-medata';


interface Ownable {
    /**
     * Who created the entity
     */
    createdBy?: unknown;
    /**
     * Who updated the entity
     */
    updatedBy?: unknown;
}

/**
 * This decorator is used to mark classes that will be an entity (table or document depend on database type).
 * Database schema will be created for all classes decorated with it, and Repository can be retrieved and used for it.
 */
export function OwnableEntity(options?: EntityOptions): Function;

/**
 * This decorator is used to mark classes that will be an entity (table or document depend on database type).
 * Database schema will be created for all classes decorated with it, and Repository can be retrieved and used for it.
 */
export function OwnableEntity(name?: string, options?: EntityOptions): Function;

/**
 * This decorator is used to mark classes that will be an entity (table or document depend on database type).
 * Database schema will be created for all classes decorated with it, and Repository can be retrieved and used for it.
 */
export function OwnableEntity(nameOrOptions?: string | EntityOptions, maybeOptions: EntityOptions = {}): Function {
    const options = (typeof nameOrOptions === 'object' ? nameOrOptions : maybeOptions);
    const name = typeof nameOrOptions === 'string' ? nameOrOptions : options.name;

    return function(target: Function) {
        const metaData = getMetadataArgsStorage();

        metaData.tables.push({
            target: target,
            name: name,
            type: 'regular',
            orderBy: (typeof options.orderBy !== 'undefined') ? options.orderBy : undefined,
            engine: (typeof options.engine !== 'undefined') ? options.engine : undefined,
            database: (typeof options.database !== 'undefined') ? options.database : undefined,
            schema: (typeof options.schema !== 'undefined') ? options.schema : undefined,
            synchronize: options.synchronize,
        });

        metaData.joinColumns.push({
            target: target,
            propertyName: 'createdBy',
            name: 'created_by',
        });

        metaData.joinColumns.push({
            target: target,
            propertyName: 'updatedBy',
            name: 'updated_by',
        });

        metaData.relations.push({
            target,
            propertyName: 'createdBy',
            relationType: 'many-to-one',
            isLazy: false,
            type: () => UserManagementMetadata.instance.userClass,
            inverseSideProperty: undefined,
            options: {
                eager: true,
            },
        });

        metaData.relations.push({
            target,
            propertyName: 'updatedBy',
            relationType: 'many-to-one',
            isLazy: false,
            type: () => UserManagementMetadata.instance.userClass,
            inverseSideProperty: undefined,
            options: {
                eager: true,
            },
        });

        target.prototype.addCreatedBy = function(this: Ownable) {
            this.createdBy = RequestContext.currentUser();
        };

        target.prototype.addUpdatedBy = function(this: Ownable) {
            this.updatedBy = RequestContext.currentUser();
        };

        metaData.entityListeners.push({
            target,
            propertyName: 'addCreatedBy',
            type: 'before-insert',
        });

        metaData.entityListeners.push({
            target,
            propertyName: 'addUpdatedBy',
            type: 'before-update',
        });
    };
}
