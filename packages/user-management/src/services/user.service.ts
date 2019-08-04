/*!
 * @copyright FLYACTS GmbH 2019
 */

import { UnauthorizedError } from '@flyacts/routing-controllers';
import {
    Service,
} from 'typedi';
import {
    Connection,
    IsNull,
    Not,
} from 'typeorm';

import { TokenEntity } from '../entities/token.entity';
import { UserEntity } from '../entities/user.entity';


const uidgen = new (require('uid-generator'))(256);

/**
 * Service for providing crud operations
 */
@Service()
export class UserService {
    public constructor(
        public connection: Connection,
    ) {}

    /**
     * Login method
     */
    public async login(username: string, password: string, realm: string) {
        const user = await this.connection.manager.findOne(UserEntity, {
            where: {
                username: username,
                realm: realm,
                disabled: false,
                password: Not(IsNull()),
            },
        });


        if (typeof user === 'undefined') {
            return undefined;
        }

        if (!(await user.verifyPassword(password))) {
            return undefined;
        }

        const token = new TokenEntity();

        token.user = user;
        token.token = await uidgen.generate();
        token.scopes = ['authorization'];

        await this.connection.manager.save(token);

        return token;
    }

    /**
     * Logout method
     */
    public async logout(token: string) {
        const tokenEntity = await this.connection.manager.findOne(TokenEntity, {
            where: {
                token: token,
            },
        });

        if (!(tokenEntity instanceof TokenEntity)) {
            throw new UnauthorizedError();
        }

        await this.connection.manager.delete(TokenEntity, tokenEntity.id);
    }

}
