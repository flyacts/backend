/*!
 * @copyright FLYACTS GmbH 2019
 */

import { BaseEntity } from '@flyacts/backend-core-entities';

import { UserEntity } from '../entities/user.entity';

/**
 * Constructor for a user type
 */
export interface UserConstructor {
    new (): BaseEntity;
}

/**
 * Class for storing user management specific settings
 */
export class UserManagementMetadata {
    /**
     * The user class which should be used
     */
    public userClass: UserConstructor;

    /**
     * Indicate if the ownable content should actualy be enforced
     */
    public enforceOwnableContent: boolean = false;

    /**
     * Single instance of this class
     */
    public static instance: UserManagementMetadata = new UserManagementMetadata();

    private constructor() {
        this.userClass = UserEntity;
    }
}
