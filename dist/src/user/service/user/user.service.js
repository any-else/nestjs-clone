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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const User_entity_1 = require("../../../typeorm/entities/User.entity");
const role_enum_1 = require("../../../types/role.enum");
const typeorm_2 = require("typeorm");
let UserService = class UserService {
    constructor(userRespository) {
        this.userRespository = userRespository;
    }
    async createUser(createUserDetail, res) {
        try {
            const newUser = this.userRespository.create({
                name: createUserDetail.name,
                email: createUserDetail.email,
                phone: createUserDetail.phone,
                address: createUserDetail.address,
                password: createUserDetail.password,
            });
            await this.userRespository.save(newUser);
            return res.status(201).json({
                status: 'success',
                message: 'Create success',
            });
        }
        catch (err) {
            console.log(err);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({
                    status: 'error',
                    message: 'Email or Phone already exists',
                });
            }
            else if (err.code === 'ER_CHECK_CONSTRAINT_VIOLATED') {
                return res.status(400).json({
                    status: 'error',
                    message: 'Please check gender (male, female, other) , role (user, seller , admin)',
                });
            }
            else {
                return res.status(400).json({
                    status: 'error',
                    message: err.message,
                });
            }
        }
    }
    async getAllUsers(res) {
        try {
            const users = await this.userRespository.find({
                where: {
                    role: role_enum_1.Role.User,
                },
            });
            return res.status(200).json({
                status: 'success',
                users,
            });
        }
        catch (err) {
            return res.status(400).json({
                status: 'error',
                message: err.message,
            });
        }
    }
    async findOneUser(id, res) {
        try {
            const user = await this.userRespository.findOne({
                where: {
                    _id: id,
                },
            });
            if (!user) {
                throw new Error('User not found');
            }
            return res.status(200).json({
                status: 'success',
                user,
            });
        }
        catch (err) {
            return res.status(400).json({
                status: 'error',
                message: err.message,
            });
        }
    }
    async deleteOneUser(id, res) {
        try {
            const user = await this.userRespository.findOne({
                where: {
                    _id: id,
                },
            });
            if (!user) {
                throw new Error('User not found');
            }
            await this.userRespository.remove(user);
            return res.status(200).json({
                status: 'success',
                message: 'Delete success',
            });
        }
        catch (err) {
            return res.status(400).json({
                status: 'error',
                message: err.message,
            });
        }
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(User_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map