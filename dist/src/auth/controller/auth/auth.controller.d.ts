/// <reference types="multer" />
import { AuthService } from 'src/auth/service/auth/auth.service';
import { LoginDto } from 'src/dtos/Login.dto';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { ForgotPassword } from 'src/dtos/ForgotPassword.dto';
import { ResetPassword } from 'src/dtos/ResetPasswrod.dto';
import { UpdatePasswordDto } from 'src/dtos/UpdatePassword.dto';
import { PhoneOtp } from 'src/dtos/PhoneOtp.dto';
import { UpdatePhoneDto } from 'src/dtos/UpdatePhone.dto';
import { UpdateUser } from 'src/dtos/UpdateUser.dto';
import { MailjetService } from 'nest-mailjet';
export declare class AuthController {
    private authService;
    private readonly mailjetService;
    private readonly configService;
    constructor(authService: AuthService, mailjetService: MailjetService, configService: ConfigService);
    loginController(loginDto: LoginDto, res: Response): Promise<Response<any, Record<string, any>>>;
    logoutController(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    forgotPasswordController(forgotAccountEmailDto: ForgotPassword, res: Response): Promise<Response<any, Record<string, any>>>;
    updateMeController(updateMeDto: UpdateUser, file: Express.Multer.File, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    resetPasswordController(resetPasswordDto: ResetPassword, token: string, res: Response): Promise<void>;
    updatePasswordController(updatePasswordDto: UpdatePasswordDto, res: Response, req: Request): Promise<void>;
    sentOtpController(phoneOtpDto: PhoneOtp, res: Response, req: Request): Promise<Response<any, Record<string, any>>>;
    updatePhoneController(newPhone: UpdatePhoneDto, res: Response, req: Request): Promise<void>;
    resetPasswordBasePhoneController(phoneResetDto: PhoneOtp, res: Response, req: Request): Promise<void>;
    verifyEmailController(verifyEmailDto: {
        email: string;
    }, res: Response, req: Request): Promise<Response<any, Record<string, any>>>;
    confirmVerificationController(confirmEmailDto: {
        otp: string;
    }, res: Response, req: Request): Promise<Response<any, Record<string, any>>>;
    changeEmailController(changeEmailDto: {
        newEmail: string;
    }, res: Response, req: Request): Promise<Response<any, Record<string, any>>>;
    sendEmail(sendEmailDto: {
        email: string;
    }, res: Response, req: Request): Promise<Response<any, Record<string, any>>>;
}
