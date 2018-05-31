import {Entity, PrimaryGeneratedColumn, Column, IsNull, CreateDateColumn, UpdateDateColumn} from "typeorm";

export abstract class BaseModel {

    @PrimaryGeneratedColumn()
    public id: number;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt?: Date;
}
