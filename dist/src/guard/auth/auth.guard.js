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
exports.AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const User_entity_1 = require("../../typeorm/entities/User.entity");
const typeorm_2 = require("typeorm");
const core_1 = require("@nestjs/core");
const roles_decorator_1 = require("../../decorator/roles.decorator");
const TokenBlackList_entity_1 = require("../../typeorm/entities/TokenBlackList.entity");
let AuthGuard = class AuthGuard {
    constructor(jwtService, userRespository, tokenBlackListRespository, reflector) {
        this.jwtService = jwtService;
        this.userRespository = userRespository;
        this.tokenBlackListRespository = tokenBlackListRespository;
        this.reflector = reflector;
    }
    async canActivate(context) {
        try {
            const request = context.switchToHttp().getRequest();
            let token;
            if (request.headers.authorization &&
                request.headers.authorization.startsWith('Bearer')) {
                token = request.headers.authorization.split(' ')[1];
            }
            if (!token) {
                throw new common_1.HttpException({
                    message: 'You are not login , please login to access this link',
                    status: 'unauthorized',
                }, common_1.HttpStatus.UNAUTHORIZED);
            }
            const checkToken = await this.tokenBlackListRespository.findOne({
                where: {
                    token: token,
                },
            });
            if (checkToken) {
                throw new common_1.HttpException({
                    message: 'You are not login , please login to access this link',
                    status: 'unauthorized',
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            const payload = await this.jwtService.verifyAsync(token);
            const currentUser = await this.userRespository.findOne({
                where: { _id: payload.id },
            });
            if (!currentUser) {
                throw new common_1.HttpException({ message: 'This User is not exists', status: 'unauthorized' }, common_1.HttpStatus.NOT_FOUND);
            }
            if (currentUser.changedPasswordAfter(payload.iat)) {
                throw new common_1.HttpException({
                    message: 'Your account has changed, please login again',
                    status: 'unauthorized',
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            request['user'] = currentUser;
            const requiredRoles = this.reflector.getAllAndOverride(roles_decorator_1.ROLES_KEY, [context.getHandler(), context.getClass()]);
            if (!requiredRoles) {
                return true;
            }
            return requiredRoles.some((role) => request['user'].role === role);
        }
        catch (err) {
            console.log(err);
            throw new common_1.HttpException({
                message: err.message,
                status: 'unauthorized',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
AuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(User_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(TokenBlackList_entity_1.TokenBlackList)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        core_1.Reflector])
], AuthGuard);
exports.AuthGuard = AuthGuard;
//# sourceMappingURL=auth.guard.js.map