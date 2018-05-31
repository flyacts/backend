import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

import { BaseModel } from '../models';

@Entity()
export class UserModel extends BaseModel {
    @Column({
        nullable: true,
    })
    public username?: string;

    @Column()
    public password: string;

    @Column({
        nullable: true,
    })
    public realm?: string;

    @Column()
    public email: string;

    @Column()
    public emailVerified: boolean = false;
}