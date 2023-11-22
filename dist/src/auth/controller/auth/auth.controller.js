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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../../service/auth/auth.service");
const Login_dto_1 = require("../../../dtos/Login.dto");
const config_1 = require("@nestjs/config");
const ForgotPassword_dto_1 = require("../../../dtos/ForgotPassword.dto");
const ResetPasswrod_dto_1 = require("../../../dtos/ResetPasswrod.dto");
const UpdatePassword_dto_1 = require("../../../dtos/UpdatePassword.dto");
const auth_guard_1 = require("../../../guard/auth/auth.guard");
const PhoneOtp_dto_1 = require("../../../dtos/PhoneOtp.dto");
const UpdatePhone_dto_1 = require("../../../dtos/UpdatePhone.dto");
const UpdateUser_dto_1 = require("../../../dtos/UpdateUser.dto");
const multer_1 = require("multer");
const platform_express_1 = require("@nestjs/platform-express");
const nest_mailjet_1 = require("nest-mailjet");
let AuthController = class AuthController {
    constructor(authService, mailjetService, configService) {
        this.authService = authService;
        this.mailjetService = mailjetService;
        this.configService = configService;
    }
    loginController(loginDto, res) {
        return this.authService.loginService(loginDto, res);
    }
    logoutController(req, res) {
        return this.authService.logoutService(req, res);
    }
    forgotPasswordController(forgotAccountEmailDto, res) {
        return this.authService.forgotPasswordService(forgotAccountEmailDto.email, res);
    }
    updateMeController(updateMeDto, file, req, res) {
        console.log(file);
        return this.authService.updateProfileService(updateMeDto, file, req, res);
    }
    resetPasswordController(resetPasswordDto, token, res) {
        return this.authService.resetPasswordViaEmail(token, resetPasswordDto, res);
    }
    updatePasswordController(updatePasswordDto, res, req) {
        return this.authService.updatePassword(updatePasswordDto, res, req);
    }
    sentOtpController(phoneOtpDto, res, req) {
        return this.authService.sendOtp(phoneOtpDto.phone, res, req);
    }
    updatePhoneController(newPhone, res, req) {
        return this.authService.updatePhoneService(newPhone.phone, newPhone.otp, res, req);
    }
    resetPasswordBasePhoneController(phoneResetDto, res, req) {
        return this.authService.resetPasswordBasePhoneService(phoneResetDto.phone, res, req);
    }
    verifyEmailController(verifyEmailDto, res, req) {
        return this.authService.verifyEmailService(verifyEmailDto.email, req, res);
    }
    confirmVerificationController(confirmEmailDto, res, req) {
        return this.authService.changeEmailService(confirmEmailDto.otp, req, res);
    }
    changeEmailController(changeEmailDto, res, req) {
        return this.authService.updateEmailService(changeEmailDto.newEmail, req, res);
    }
    async sendEmail(sendEmailDto, res, req) {
        try {
            const repl = await this.mailjetService.send({
                Messages: [
                    {
                        From: {
                            Email: this.configService.get('EMAIL_FROM'),
                            Name: 'AMZ Store',
                        },
                        To: [
                            {
                                Email: sendEmailDto.email,
                            },
                        ],
                        Subject: 'nestjs test mail',
                        TextPart: 'nestjs test mail content',
                    },
                ],
            });
            return res.status(200).json({
                status: 'success',
                message: 'Check email to verify your account',
            });
        }
        catch (err) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                status: 'error',
                message: err.message,
            });
        }
    }
};
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Login_dto_1.LoginDto, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "loginController", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('logout'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logoutController", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ForgotPassword_dto_1.ForgotPassword, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "forgotPasswordController", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Patch)('updateMe'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('photo', {
        storage: (0, multer_1.memoryStorage)(),
        fileFilter(req, file, callback) {
            if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|avif|AVIF|webp|WEBP)$/)) {
                req.fileValidationError = 'Only image files are allowed!';
                return callback(null, false);
            }
            callback(null, true);
        },
    })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UpdateUser_dto_1.UpdateUser, Object, Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "updateMeController", null);
__decorate([
    (0, common_1.Patch)('reset-password/:token'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('token')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ResetPasswrod_dto_1.ResetPassword, String, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "resetPasswordController", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Patch)('update-password'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UpdatePassword_dto_1.UpdatePasswordDto, Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "updatePasswordController", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('sent-otp'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PhoneOtp_dto_1.PhoneOtp, Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "sentOtpController", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Patch)('update-phone'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UpdatePhone_dto_1.UpdatePhoneDto, Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "updatePhoneController", null);
__decorate([
    (0, common_1.Post)('reset-password-base-phone'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PhoneOtp_dto_1.PhoneOtp, Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "resetPasswordBasePhoneController", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('verify-email'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "verifyEmailController", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('confirm-verification'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "confirmVerificationController", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('change-email'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "changeEmailController", null);
__decorate([
    (0, common_1.Post)('send-email-test'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "sendEmail", null);
AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        nest_mailjet_1.MailjetService,
        config_1.ConfigService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map