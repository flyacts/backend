/*!
 * @copyright FLYACTS GmbH 2018
 */

import { Logger } from '@flyacts/backend';
import {
    RoleEntity,
    UserEntity,
    UserService,
} from '@flyacts/backend-user-management';
import {
    Authorized,
    BadRequestError,
    Body,
    BodyParam,
    CurrentUser,
    Delete,
    Get,
    HeaderParam,
    InternalServerError,
    JsonController,
    NotFoundError,
    OnUndefined,
    Param,
    Post,
    Put,
    QueryParam,
    Res,
} from '@flyacts/routing-controllers';
import {
    OpenAPI,
    ResponseSchema,
} from '@flyacts/routing-controllers-openapi';
import { validate } from 'class-validator';
import * as config from 'config';
import { Response } from 'express';
import {
    Service,
} from 'typedi';
import {
    Connection,
    IsNull,
    Not,
    QueryFailedError,
} from 'typeorm';

import {
    UserExtensionEntity,
} from '../entities/user-extension.entity';
import { UserRoles } from '../enums/user-roles.enum';
import { hasValidSortField } from '../helper/funcs';

/**
 * Controller for /user
 */
@JsonController('/users')
@Service()
export class UserController {

    public constructor(
        private service: UserService,
        private connection: Connection,
        private logger: Logger,
    ) { }

    /**
     * Return all the users
     */
    @Get()
    @Authorized([
        UserRoles.Admin,
    ])
    // tslint:disable-next-line
    public async find(
        @Res() response: Response,
        @QueryParam('page') page: number = 1,
        @QueryParam('firstname') firstname?: string,
        @QueryParam('lastname') lastname?: string,
        @QueryParam('user.email') email?: string,
        @QueryParam('id') id?: number,
        @QueryParam('sortfield') sortField?: string,
        @QueryParam('sortdirection') sortDirection: 'ASC' | 'DESC' = 'ASC',
    ): Promise<UserExtensionEntity[]> {
        page = Math.floor(page);
        if ((page <= 0) || isNaN(page)) {
            page = 1;
        }
        const repo = this.connection.getRepository(UserExtensionEntity);
        const itemsPerPage = Number.parseInt(config.get('itemsPerPage'));

        const skip = (page - 1) * itemsPerPage;

        const query = repo
            .createQueryBuilder('ue')
            .leftJoinAndSelect('ue.user', 'user')
            .leftJoinAndSelect('user.roles', 'roles')
            .skip(skip)
            .take(itemsPerPage);

        if (typeof firstname === 'string') {
            query.andWhere('ue.firstname LIKE :firstname', { firstname: `%${firstname}%` });
        }

        if (typeof lastname === 'string') {
            query.andWhere('ue.lastname LIKE :lastname', { lastname: `%${lastname}%` });
        }

        if (typeof email === 'string') {
            query.andWhere('user.email LIKE :email', { email: `%${email}%` });
        }

        if (typeof id === 'number' && (!isNaN(id))) {
            query.andWhere('ue.id = :id', { id });
        }

        if (
            hasValidSortField(
                sortField,
                [
                    'firstname',
                    'lastname',
                    'user.email',
                    'id',
                ])) {
            if (!sortField.includes('.')) {
                sortField = `ue.${sortField}`;
            }
            query.orderBy(sortField, sortDirection);
        }

        const count = await query.getCount();

        response.header('X-Entity-Count', count.toString());
        response.header('X-Current-Page', page.toString());
        response.header('X-Total-Pages', (Math.ceil(count / itemsPerPage)).toString());

        return query.getMany();
    }

    /**
     * Create a user
     */
    @Post()
    @OpenAPI({
        requestBody: {
            description: 'Create a user',
            required: true,
            content: {
                // tslint:disable-next-line:no-duplicate-string
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            firstname: {
                                type: 'string',
                            },
                            lastname: {
                                type: 'string',
                            },
                            user: {
                                type: 'object',
                                properties: {
                                    email: {
                                        type: 'string',
                                    },
                                },
                            },
                        },
                    },
                    example: {
                        firstname: 'Test',
                        lastname: 'User',
                        user: {
                            email: 'test.user@test.test',
                        },
                    },
                },
            },
        },
    })
    // tslint:disable-next-line
    public async save(
        @Body() user?: UserExtensionEntity,
        @CurrentUser({ required: false }) currentUser?: UserExtensionEntity,
    ) {
        if (!(user instanceof UserExtensionEntity)) {
            throw new BadRequestError();
        }

        if (!(user.user instanceof UserEntity)) {
            throw new BadRequestError();
        }

        // tslint:disable-next-line:strict-type-predicates
        if (typeof user.id !== 'undefined') {
            throw new BadRequestError();
        }

        // tslint:disable-next-line:mccabe-complexity
        return this.connection.transaction(async (manager) => {
            try {
                let role = await this.connection.manager.findOne<RoleEntity>(RoleEntity, {
                    where: {
                        name: 'agent',
                    },
                });

                if (
                    currentUser instanceof UserExtensionEntity &&
                    currentUser.user.roles.filter(item => item.name === 'manager').length === 1) {
                    role = await manager.findOne<RoleEntity>(RoleEntity, {
                        where: {
                            name: 'subagent',
                        },
                    });
                }

                if (!(role instanceof RoleEntity)) {
                    this.logger.error(`Could not find role todo`);
                    // tslint:disable-next-line:no-duplicate-string
                    throw new InternalServerError('Internal Server Error');
                }

                const _user = new UserEntity();
                _user.email = user.user.email;
                _user.username = user.user.email;
                _user.realm = 'backoffice';
                _user.roles = [role];

                await manager.save(_user);

                const extension = new UserExtensionEntity();
                extension.firstname = user.firstname;
                extension.lastname = user.lastname;
                extension.user = _user;

                const validationErrors = await validate(extension);

                if (validationErrors.length > 0) {
                    this.logger.info('Failed validation for user', {
                        extension,
                        validationErrors,
                    });
                    const error = new BadRequestError();
                    error.message = 'Failed to validate user data';
                    throw error;
                }

                await manager.save(extension);

                return extension;
            } catch (error) {
                if (error instanceof BadRequestError) {
                    throw error;
                }

                if (error instanceof QueryFailedError &&
                    ((error.message.includes('UNIQUE') &&
                        (
                            error.message.includes('users.email') ||
                            error.message.includes('users.user')
                        )
                    ) ||
                        (error.message.includes('uq___users___')))) {

                    throw new BadRequestError();
                }
                this.logger.error('Failed to execute query', {
                    error,
                    user,
                });
                throw new InternalServerError('Internal Server Error');
            }
        });
    }

    /**
     * Delete a user by its id
     */
    @Delete('/:id')
    @Authorized([
        UserRoles.Admin,
    ])
    public async delete(@Param('id') id: number) {
        const user = await this.findById(id);
        await this.connection.manager.remove(user);
    }

    /**
     * Change user password
     */
    @Post('/change-password')
    @OnUndefined(204)
    @OpenAPI({
        requestBody: {
            description: 'Change user password',
            required: true,
            content: {
                'application/json': {
                    schema: {
                        description: 'Schema for the change password',
                        type: 'object',
                        properties: {
                            oldPassword: {
                                type: 'string',
                            },
                            newPassword: {
                                type: 'string',
                            },
                        },
                    },
                    example: {
                        // tslint:disable-next-line: no-hardcoded-credentials
                        oldPassword: '123456',
                        newPassword: '1234567',
                    },
                },
            },
        },
    })
    public async changePassword(
        @BodyParam('oldPassword') oldPassword: string,
        @BodyParam('newPassword') newPassword: string,
        @CurrentUser() currentUser: UserExtensionEntity,
    ) {
        const hasValidPassword = await currentUser.user.verifyPassword(oldPassword);
        if (!hasValidPassword) {
            throw new BadRequestError();
        }
        if (!(newPassword.length > 0)) {
            throw new BadRequestError();
        }
        await currentUser.user.setPassword(newPassword);
        await this.connection.manager.save(currentUser.user);
    }

    /**
     * Fetch a single user by its id
     *
     * @param id The user identifier
     */
    @Get('/:id([0-9]+)')
    @Authorized([
        UserRoles.Admin,
    ])
    @OnUndefined(404)
    @ResponseSchema(UserExtensionEntity)
    public async findById(
        @Param('id') id: number,
    ) {
        return this
            .connection
            .getRepository(UserExtensionEntity)
            .createQueryBuilder('ue')
            .innerJoin('ue.user', 'u')
            .where('ue.id = :id', { id })
            .getOne();
    }

    /**
     * Return the currently logged in user
     */
    @Get('/me')
    @Authorized()
    @ResponseSchema(UserExtensionEntity)
    public async findMe(@CurrentUser() currentUser: UserExtensionEntity) {
        return currentUser;
    }

    /**
     * Create an accesstoken with the credentials provided by the user
     */
    @Post('/login')
    @OnUndefined(401)
    @OpenAPI({
        requestBody: {
            description: 'Authorization information',
            required: true,
            content: {
                'application/json': {
                    schema: {
                        description: 'Schema for the login request',
                        type: 'object',
                        properties: {
                            username: {
                                type: 'string',
                            },
                            password: {
                                type: 'string',
                            },
                            realm: {
                                type: 'string',
                            },
                        },
                    },
                    example: {
                        username: 'admin@test.test',
                        // tslint:disable-next-line: no-hardcoded-credentials
                        password: '123456',
                        realm: 'backoffice',
                    },
                },
            },
        },
    })
    public async login(
        @BodyParam('username') username: string,
        @BodyParam('password') password: string,
        @BodyParam('realm') realm: string,
    ) {
        const user = await this.connection.manager.findOne(UserEntity, {
            where: {
                username: username,
                realm: realm,
                disabled: false,
                password: Not(IsNull()),
            },
        });

        const extension = await this.connection.manager.findOne(UserExtensionEntity, {
            where: {
                user,
            },
        });

        if (!(extension instanceof UserExtensionEntity)) {
            return;
        }

        return this.service.login(username, password, realm);
    }

    /**
     * Logout the current user
     */
    @Post('/logout')
    @Authorized()
    @OnUndefined(204)
    public async logout(
        @HeaderParam('authorization') token: string,
    ) {
        return this.service.logout(token);
    }

    /**
     * Update an existing user
     */
    @Put('/:id')
    @Authorized([
        UserRoles.Admin,
    ])
    @OnUndefined(500)
    public async update(
        @Param('id') userId: number,
        @Body() user: UserExtensionEntity,
    ) {
        const existingUser = await this.findById(userId);

        if (!(existingUser instanceof UserExtensionEntity)) {
            throw new NotFoundError();
        }

        existingUser.firstname = user.firstname;
        existingUser.lastname = user.lastname;

        await this.handleValidation(existingUser);

        return this.connection.manager.save(existingUser);
    }

    /**
     * Handle possible validation errors at a central place
     */
    private async handleValidation(data: Object) {
        const validationErrors = await validate(data);

        if (validationErrors.length > 0) {
            this.logger.info('Failed validation for user', {
                data,
                validationErrors,
            });

            const error = new BadRequestError();
            error.message = 'Failed to validate user data';
            throw error;
        }
    }
}
