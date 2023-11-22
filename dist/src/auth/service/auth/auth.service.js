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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cloudinary_1 = require("cloudinary");
const User_entity_1 = require("../../../typeorm/entities/User.entity");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const mailer_1 = require("@nestjs-modules/mailer");
const nestjs_twilio_1 = require("nestjs-twilio");
const crypto = require("crypto");
const nest_mailjet_1 = require("nest-mailjet");
const config_1 = require("@nestjs/config");
const TokenBlackList_entity_1 = require("../../../typeorm/entities/TokenBlackList.entity");
let AuthService = class AuthService {
    constructor(userRespository, tokenBlackListRespository, jwtService, mailService, twilioService, mailjetService, configService) {
        this.userRespository = userRespository;
        this.tokenBlackListRespository = tokenBlackListRespository;
        this.jwtService = jwtService;
        this.mailService = mailService;
        this.twilioService = twilioService;
        this.mailjetService = mailjetService;
        this.configService = configService;
    }
    signToken(id) {
        return this.jwtService.signAsync({ id });
    }
    async createSendToken(user, statusCode, res) {
        const token = await this.signToken(user._id.toString());
        const { password } = user, rest = __rest(user, ["password"]);
        res.status(statusCode).json({
            status: 'success',
            token,
            user: rest,
        });
    }
    async loginService(loginService, res) {
        try {
            const user = await this.userRespository.findOne({
                where: [
                    { email: loginService.account },
                    { phone: loginService.account },
                ],
            });
            if (!user ||
                !(await bcrypt.compare(loginService.password, user.password))) {
                return res.status(common_1.HttpStatus.UNAUTHORIZED).json({
                    status: 'error',
                    message: 'Your account or Password in correct !',
                });
            }
            this.createSendToken(user, 200, res);
        }
        catch (err) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                status: 'error',
                message: err.message,
            });
        }
    }
    async logoutService(req, res) {
        try {
            const createBlackList = this.tokenBlackListRespository.create({
                token: req.headers.authorization.split(' ')[1],
            });
            await this.tokenBlackListRespository.save(createBlackList);
            return res.status(common_1.HttpStatus.OK).json({
                status: 'success',
                message: 'Logout successfully !',
            });
        }
        catch (err) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                status: 'error',
                message: err.message,
            });
        }
    }
    async updateProfileService(updateUser, file, req, res) {
        try {
            console.log(file);
            const user = await this.userRespository.findOne({
                where: {
                    _id: req['user']._id,
                },
            });
            if (!user) {
                throw new Error('User not found');
            }
            user.name = updateUser.name;
            user.address = updateUser.address;
            user.birthday = new Date(updateUser.birthday);
            user.gender = updateUser.gender;
            if (file && file.fieldname === 'photo') {
                const { originalname, buffer, fieldname } = file;
                const result = await new Promise((resolve, reject) => {
                    cloudinary_1.v2.uploader
                        .upload_stream({
                        folder: 'my_image_user',
                        public_id: originalname.split('.')[0],
                        resource_type: 'image',
                    }, (error, result) => {
                        if (error) {
                            reject(error);
                        }
                        else {
                            resolve(result);
                        }
                    })
                        .end(buffer);
                });
                user.photo = result.url;
            }
            await this.userRespository.save(user);
            const { password } = user, rest = __rest(user, ["password"]);
            return res.status(200).json({
                status: 'success',
                user: rest,
            });
        }
        catch (err) {
            return res.status(400).json({
                status: 'error',
                message: err.message,
            });
        }
    }
    async forgotPasswordService(forgotPasswordService, res) {
        const account = await this.userRespository.findOneOrFail({
            where: { email: forgotPasswordService },
        });
        try {
            if (!account) {
                throw new common_1.HttpException({ message: 'No account have this email', status: 'error' }, common_1.HttpStatus.NOT_FOUND);
            }
            if (account.googleId) {
                throw new common_1.HttpException({
                    message: 'This account sign in via google, please log back in with your google account',
                    status: 'error',
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            const resetToken = account.createPasswordResetToken();
            await this.userRespository.save(account);
            var response = await this.mailService.sendMail({
                to: forgotPasswordService,
                from: process.env.EMAIL_FROM,
                subject: 'FORGOT PASSWORD',
                text: `Hello ${account.name},\n\nYou have requested a password change on AMAZON shop. Please visit the password change page and follow the instructions to complete the process.\n\nSincerely,\nAMAZON`,
                html: `<h3>Hello ${account.name},</h3><p>You have requested to change your password on AMAZON shop. Please visit the change password page and follow the instructions to complete the process.<br /> <a href="http://localhost:3000/account/user/resetPassword/${resetToken}">At here !</a> </p><p>Sincerely,</p><p>AMAZON</p>`,
            });
            const repl = await this.mailjetService.send({
                Messages: [
                    {
                        From: {
                            Email: this.configService.get('EMAIL_FROM'),
                            Name: 'AMZ SHOP',
                        },
                        To: [
                            {
                                Email: forgotPasswordService,
                            },
                        ],
                        Subject: 'FORGOT PASSWORD',
                        TextPart: `Hello ${account.name},\n\nYou have requested a password change on AMAZON shop. Please visit the password change page and follow the instructions to complete the process.\n\nSincerely,\nAMAZON`,
                        HTMLPart: `<h3>Hello ${account.name},</h3><p>You have requested to change your password on AMAZON shop. Please visit the change password page and follow the instructions to complete the process.<br /> <a href="${this.configService.get('FRONTEND_URL')}/account/user/resetPassword/${resetToken}">At here !</a> </p><p>Sincerely,</p><p>AMAZON</p>`,
                    },
                ],
            });
            return res.status(common_1.HttpStatus.OK).json({
                status: 'success',
                message: 'email sent',
            });
        }
        catch (err) {
            account.passwordResetToken = null;
            account.passwordResetExpire = null;
            await this.userRespository.save(account);
            throw new common_1.HttpException({
                message: 'AMAZON system has some error , please comback later',
                status: 'error',
                description: err,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async resetPasswordViaEmail(tokenService, resetPassword, res) {
        try {
            if (resetPassword.password !== resetPassword.passwordConfirm) {
                throw new common_1.HttpException({
                    status: 'error',
                    message: 'Password and password confirm must be match !',
                }, common_1.HttpStatus.NOT_ACCEPTABLE);
            }
            const hashedToken = crypto
                .createHash('sha256')
                .update(tokenService)
                .digest('hex');
            const account = await this.userRespository.findOne({
                where: {
                    passwordResetToken: hashedToken,
                    passwordResetExpire: (0, typeorm_2.MoreThan)(new Date(Date.now())),
                },
            });
            if (!account) {
                throw new common_1.HttpException({ status: 'error', message: 'This reset code has expired' }, common_1.HttpStatus.NOT_FOUND);
            }
            account.setPassword(resetPassword.password);
            account.passwordResetToken = null;
            account.passwordResetExpire = null;
            await this.userRespository.save(account);
            res.status(common_1.HttpStatus.OK).json({
                status: 'success',
            });
        }
        catch (err) {
            throw new common_1.HttpException({
                message: 'Some thing when wrong , please try again !',
                status: 'error',
                description: err,
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updatePassword(updatePasswordService, res, req) {
        try {
            const account = await this.userRespository.findOne({
                where: { _id: req['user']._id },
            });
            if (!account) {
                res.status(common_1.HttpStatus.NOT_FOUND).json({
                    status: 'error',
                    message: 'This account is not exist , please try again !',
                });
            }
            if (!(await bcrypt.compare(updatePasswordService.passwordCurrent, account.password))) {
                res.status(common_1.HttpStatus.NOT_ACCEPTABLE).json({
                    status: 'error',
                    message: 'Your current password is wrong !',
                });
            }
            if (updatePasswordService.password !== updatePasswordService.passwordConfirm) {
                res.status(common_1.HttpStatus.NOT_ACCEPTABLE).json({
                    status: 'error',
                    message: 'Password and password confirm must be match !',
                });
            }
            account.setPassword(updatePasswordService.password);
            await this.userRespository.save(account);
            const { password } = account, rest = __rest(account, ["password"]);
            res.cookie('jwt', 'tuyendeptrai', {
                expires: new Date(Date.now()),
                httpOnly: true,
            });
            res.status(200).json({
                status: 'success',
                user: rest,
            });
        }
        catch (err) {
            throw new common_1.HttpException({
                status: 'error',
                message: 'Server side problem , we will fix it quickly , sorry !',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async sendOtp(phoneNumberService, res, req) {
        const account = await this.userRespository.findOneOrFail({
            where: { _id: req['user']._id },
        });
        try {
            if (!account) {
                throw new common_1.HttpException({ status: 'error', message: 'Not found this account' }, common_1.HttpStatus.NOT_FOUND);
            }
            const otp = Math.floor(100000 + Math.random() * 900000);
            account.otp = otp.toString();
            account.otpExpire = new Date(Date.now() + 10 * 60 * 1000);
            await this.userRespository.save(account);
            await this.twilioService.client.messages.create({
                body: `Your otp is: ${otp} (10 minutes)`,
                from: '+14344426635',
                to: `+84${parseInt(phoneNumberService)}`,
            });
            res.status(common_1.HttpStatus.OK).json({
                status: 'success',
                message: 'Otp is sent',
            });
        }
        catch (err) {
            return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                status: 'error',
                message: err.message,
            });
        }
    }
    async updatePhoneService(newPhone, otp, res, req) {
        try {
            const account = await this.userRespository.findOne({
                where: { _id: req['user']._id },
            });
            if (account.otp === otp && account.otpExpire > new Date(Date.now())) {
                account.otp = null;
                account.otpExpire = null;
                account.phone = newPhone;
                await this.userRespository.save(account);
                const { password } = account, rest = __rest(account, ["password"]);
                res.status(200).json({
                    status: 'success',
                    message: 'thay đổi sdt thành công',
                    user: rest,
                });
            }
            else {
                res.status(common_1.HttpStatus.NOT_ACCEPTABLE).json({ message: 'Invalid OTP' });
            }
        }
        catch (err) {
            throw new common_1.HttpException({
                status: 'error',
                message: 'Server side problem , we will fix it quickly , sorry !',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async resetPasswordBasePhoneService(phone, res, req) {
        try {
            const account = await this.userRespository.findOne({
                where: { phone: phone },
            });
            if (!account) {
                res.status(common_1.HttpStatus.NOT_FOUND).json({
                    status: 'error',
                    message: 'We dont see account with this phone number',
                });
            }
            const randomString = Math.random().toString(36).substring(2, 10);
            account.setPassword(randomString);
            await this.userRespository.save(account);
            await this.twilioService.client.messages.create({
                body: `Your reset password is : ${randomString}`,
                from: process.env.TWILLO_NUMBER,
                to: `+84${parseInt(phone)}`,
            });
            res.status(200).json({
                status: 'success',
                message: 'Sent your new password',
            });
        }
        catch (err) {
            console.log(err);
            throw new common_1.HttpException({
                status: 'error',
                message: 'Server side problem , we will fix it quickly , sorry !',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async verifyEmailService(email, req, res) {
        try {
            const mailOtp = Math.floor(100000 + Math.random() * 900000);
            const user = await this.userRespository.findOne({
                where: {
                    email: email,
                },
            });
            user.emailToken = mailOtp.toString();
            user.mailTokenExpire = new Date(Date.now() + 10 * 60 * 1000);
            await this.userRespository.save(user);
            const repl = await this.mailjetService.send({
                Messages: [
                    {
                        From: {
                            Email: this.configService.get('EMAIL_FROM'),
                            Name: 'AMZ SHOP',
                        },
                        To: [
                            {
                                Email: email,
                            },
                        ],
                        Subject: 'OTP FOR EMAIL CHANGE',
                        TextPart: `Hello ${user.name}\n
                You have requested to change your email address on AMAZON shop. Please visit the email change page and follow the instructions to complete the process.
                \nSincerely,
                \nAMAZON`,
                        HTMLPart: `<h3>Hello ${user.name},</h3>
                <p>You have requested to change your email address on AMAZON shop.<br /> Your otp is: ${mailOtp}<br /></p>
                <p>Sincerely,</p>
                <p>AMAZON</p>`,
                    },
                ],
            });
            return res.status(200).json({
                status: 'success',
                message: 'Check email to verify your account',
            });
        }
        catch (err) {
            return res.status(400).json({
                status: 'error',
                message: err.message,
            });
        }
    }
    async changeEmailService(mailOtp, req, res) {
        try {
            var user = await this.userRespository.findOne({
                where: {
                    _id: req['user']._id,
                    emailToken: mailOtp,
                    mailTokenExpire: (0, typeorm_2.MoreThan)(new Date(Date.now())),
                },
            });
            if (!user) {
                throw new Error('This otp has expired');
            }
            user.emailToken = null;
            user.mailTokenExpire = null;
            user.verified = true;
            await this.userRespository.save(user);
            const { password } = user, rest = __rest(user, ["password"]);
            return res.status(200).json({
                status: 'success',
                message: 'Email verified',
                user: rest,
            });
        }
        catch (err) {
            user.emailToken = null;
            user.mailTokenExpire = null;
            user.verified = false;
            await this.userRespository.save(user);
            return res.status(400).json({
                status: 'error',
                message: err.message,
            });
        }
    }
    async updateEmailService(newEmail, req, res) {
        try {
            const user = await this.userRespository.findOne({
                where: {
                    _id: req['user']._id,
                },
            });
            if (!user) {
                throw new Error('User not found');
            }
            if (!user.verified) {
                throw new Error('Email not verified');
            }
            user.email = newEmail;
            user.verified = false;
            await this.userRespository.save(user);
            const { password } = user, rest = __rest(user, ["password"]);
            return res.status(200).json({
                status: 'success',
                user: rest,
            });
        }
        catch (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({
                    status: 'error',
                    message: 'Email or Phone already exists',
                });
            }
            return res.status(400).json({
                status: 'error',
                message: err.message,
            });
        }
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(User_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(TokenBlackList_entity_1.TokenBlackList)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService,
        mailer_1.MailerService,
        nestjs_twilio_1.TwilioService,
        nest_mailjet_1.MailjetService,
        config_1.ConfigService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map