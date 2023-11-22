/// <reference types="multer" />
import { User } from 'src/typeorm/entities/User.entity';
import { LoginService, ResetPasswordService, UpdatePasswordService, UpdateProfile } from 'src/types/types';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { MailerService } from '@nestjs-modules/mailer';
import { TwilioService } from 'nestjs-twilio';
import { MailjetService } from 'nest-mailjet';
import { ConfigService } from '@nestjs/config';
import { TokenBlackList } from 'src/typeorm/entities/TokenBlackList.entity';
export declare class AuthService {
    private userRespository;
    private tokenBlackListRespository;
    private jwtService;
    private mailService;
    private twilioService;
    private readonly mailjetService;
    private readonly configService;
    constructor(userRespository: Repository<User>, tokenBlackListRespository: Repository<TokenBlackList>, jwtService: JwtService, mailService: MailerService, twilioService: TwilioService, mailjetService: MailjetService, configService: ConfigService);
    signToken(id: string): Promise<string>;
    createSendToken(user: User, statusCode: number, res: Response): Promise<void>;
    loginService(loginService: LoginService, res: Response): Promise<Response<any, Record<string, any>>>;
    logoutService(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    updateProfileService(updateUser: UpdateProfile, file: Express.Multer.File, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    forgotPasswordService(forgotPasswordService: string, res: Response): Promise<Response<any, Record<string, any>>>;
    resetPasswordViaEmail(tokenService: string, resetPassword: ResetPasswordService, res: Response): Promise<void>;
    updatePassword(updatePasswordService: UpdatePasswordService, res: Response, req: Request): Promise<void>;
    sendOtp(phoneNumberService: string, res: Response, req: Request): Promise<Response<any, Record<string, any>>>;
    updatePhoneService(newPhone: string, otp: string, res: Response, req: Request): Promise<void>;
    resetPasswordBasePhoneService(phone: string, res: Response, req: Request): Promise<void>;
    verifyEmailService(email: string, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    changeEmailService(mailOtp: string, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    updateEmailService(newEmail: string, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
