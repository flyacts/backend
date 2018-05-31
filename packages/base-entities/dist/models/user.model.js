"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const models_1 = require("../models");
let UserModel = class UserModel extends models_1.BaseModel {
    constructor() {
        super(...arguments);
        this.emailVerified = false;
    }
};
__decorate([
    typeorm_1.Column({
        nullable: true,
    }),
    __metadata("design:type", String)
], UserModel.prototype, "username", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], UserModel.prototype, "password", void 0);
__decorate([
    typeorm_1.Column({
        nullable: true,
    }),
    __metadata("design:type", String)
], UserModel.prototype, "realm", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], UserModel.prototype, "email", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], UserModel.prototype, "emailVerified", void 0);
UserModel = __decorate([
    typeorm_1.Entity()
], UserModel);
exports.UserModel = UserModel;
//# sourceMappingURL=user.model.js.map