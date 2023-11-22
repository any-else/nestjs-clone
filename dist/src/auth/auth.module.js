"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_controller_1 = require("./controller/auth/auth.controller");
const auth_service_1 = require("./service/auth/auth.service");
const user_module_1 = require("../user/user.module");
const typeorm_1 = require("@nestjs/typeorm");
const User_entity_1 = require("../typeorm/entities/User.entity");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const mailer_1 = require("@nestjs-modules/mailer");
const nestjs_twilio_1 = require("nestjs-twilio");
const nest_mailjet_1 = require("nest-mailjet");
const TokenBlackList_entity_1 = require("../typeorm/entities/TokenBlackList.entity");
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            user_module_1.UserModule,
            typeorm_1.TypeOrmModule.forFeature([User_entity_1.User, TokenBlackList_entity_1.TokenBlackList]),
            jwt_1.JwtModule.registerAsync({
                global: true,
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: {
                        expiresIn: configService.get('JWT_EXPIRE'),
                    },
                }),
            }),
            mailer_1.MailerModule.forRoot({
                transport: {
                    host: 'smtp.sendgrid.net',
                    auth: {
                        user: 'apikey',
                        pass: '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',
                    },
                },
            }),
            nest_mailjet_1.MailjetModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: () => ({
                    apiKey: process.env.API_MAILJET_KEY,
                    apiSecret: process.env.API_MAILJET_SECRET,
                }),
            }),
            nestjs_twilio_1.TwilioModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    accountSid: configService.get('TWILIO_ACCOUNT_SID'),
                    authToken: configService.get('TWILIO_AUTH_TOKEN'),
                }),
                inject: [config_1.ConfigService],
            }),
            config_1.ConfigModule,
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService],
    })
], AuthModule);
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map