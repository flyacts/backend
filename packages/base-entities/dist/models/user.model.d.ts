import { BaseModel } from '../models';
export declare class UserModel extends BaseModel {
    username?: string;
    password: string;
    realm?: string;
    email: string;
    emailVerified: boolean;
}
