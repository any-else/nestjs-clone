import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Res,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthService } from 'src/auth/service/auth/auth.service';
import { LoginDto } from 'src/dtos/Login.dto';
import { ConfigService } from '@nestjs/config';
import configuration from 'src/config/configuration';
import { Request, Response } from 'express';
import { ForgotPassword } from 'src/dtos/ForgotPassword.dto';
import { ResetPassword } from 'src/dtos/ResetPasswrod.dto';
import { UpdatePasswordDto } from 'src/dtos/UpdatePassword.dto';
import { AuthGuard } from 'src/guard/auth/auth.guard';
import { PhoneOtp } from 'src/dtos/PhoneOtp.dto';
import { UpdatePhoneDto } from 'src/dtos/UpdatePhone.dto';
import { UpdateUser } from 'src/dtos/UpdateUser.dto';
import { memoryStorage } from 'multer';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { MailjetService } from 'nest-mailjet';
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly mailjetService: MailjetService,
    private readonly configService: ConfigService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  loginController(@Body() loginDto: LoginDto, @Res() res: Response) {
    return this.authService.loginService(loginDto, res);
  }

  @UseGuards(AuthGuard)
  @Get('logout')
  logoutController(@Req() req: Request, @Res() res: Response) {
    return this.authService.logoutService(req, res);
  }

  @Post('forgot-password')
  forgotPasswordController(
    @Body() forgotAccountEmailDto: ForgotPassword,
    @Res() res: Response,
  ) {
    return this.authService.forgotPasswordService(
      forgotAccountEmailDto.email,
      res,
    );
  }

  @UseGuards(AuthGuard)
  @Patch('updateMe')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: memoryStorage(),
      fileFilter(req, file, callback) {
        if (
          !file.originalname.match(
            /\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|avif|AVIF|webp|WEBP)$/,
          )
        ) {
          req.fileValidationError = 'Only image files are allowed!';
          return callback(null, false);
        }
        callback(null, true);
      },
    }),
  )
  updateMeController(
    @Body() updateMeDto: UpdateUser,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    console.log(file);
    return this.authService.updateProfileService(updateMeDto, file, req, res);
  }

  @Patch('reset-password/:token')
  resetPasswordController(
    @Body() resetPasswordDto: ResetPassword,
    @Param('token') token: string,
    @Res() res: Response,
  ) {
    return this.authService.resetPasswordViaEmail(token, resetPasswordDto, res);
  }

  @UseGuards(AuthGuard)
  @Patch('update-password')
  updatePasswordController(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    return this.authService.updatePassword(updatePasswordDto, res, req);
  }

  @UseGuards(AuthGuard)
  @Post('sent-otp')
  sentOtpController(
    @Body() phoneOtpDto: PhoneOtp,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    return this.authService.sendOtp(phoneOtpDto.phone, res, req);
  }

  @UseGuards(AuthGuard)
  @Patch('update-phone')
  updatePhoneController(
    @Body() newPhone: UpdatePhoneDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    return this.authService.updatePhoneService(
      newPhone.phone,
      newPhone.otp,
      res,
      req,
    );
  }

  @Post('reset-password-base-phone')
  resetPasswordBasePhoneController(
    @Body() phoneResetDto: PhoneOtp,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    return this.authService.resetPasswordBasePhoneService(
      phoneResetDto.phone,
      res,
      req,
    );
  }

  @UseGuards(AuthGuard)
  @Post('verify-email')
  verifyEmailController(
    @Body() verifyEmailDto: { email: string },
    @Res() res: Response,
    @Req() req: Request,
  ) {
    return this.authService.verifyEmailService(verifyEmailDto.email, req, res);
  }

  @UseGuards(AuthGuard)
  @Post('confirm-verification')
  confirmVerificationController(
    @Body() confirmEmailDto: { otp: string },
    @Res() res: Response,
    @Req() req: Request,
  ) {
    return this.authService.changeEmailService(confirmEmailDto.otp, req, res);
  }

  @UseGuards(AuthGuard)
  @Post('change-email')
  changeEmailController(
    @Body() changeEmailDto: { newEmail: string },
    @Res() res: Response,
    @Req() req: Request,
  ) {
    return this.authService.updateEmailService(
      changeEmailDto.newEmail,
      req,
      res,
    );
  }

  @Post('send-email-test')
  async sendEmail(
    @Body() sendEmailDto: { email: string },
    @Res() res: Response,
    @Req() req: Request,
  ) {
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
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: 'error',
        message: err.message,
      });
    }
  }
}
