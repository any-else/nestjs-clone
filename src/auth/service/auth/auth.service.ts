import {
  Injectable,
  UnauthorizedException,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';

import { User } from 'src/typeorm/entities/User.entity';
import {
  LoginService,
  ResetPasswordService,
  UpdatePasswordService,
  UpdateProfile,
} from 'src/types/types';
import { MoreThan, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { MailerService } from '@nestjs-modules/mailer';
import { TwilioService } from 'nestjs-twilio';
import * as crypto from 'crypto';
import { MailjetService } from 'nest-mailjet';
import { ConfigService } from '@nestjs/config';
import { TokenBlackList } from 'src/typeorm/entities/TokenBlackList.entity';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRespository: Repository<User>,
    @InjectRepository(TokenBlackList)
    private tokenBlackListRespository: Repository<TokenBlackList>,
    private jwtService: JwtService,
    private mailService: MailerService,
    private twilioService: TwilioService,
    private readonly mailjetService: MailjetService,
    private readonly configService: ConfigService,
  ) {}
  signToken(id: string) {
    return this.jwtService.signAsync({ id });
  }
  async createSendToken(user: User, statusCode: number, res: Response) {
    const token = await this.signToken(user._id.toString());
    // const cookieOptions = {
    //   expires: new Date(
    //     Date.now() +
    //       parseInt(process.env.COOKIE_EXPIRES, 10) * 24 * 60 * 60 * 1000,
    //   ),
    //   httpOnly: true,
    // };
    // res.cookie('jwt', token, cookieOptions);

    const { password, ...rest } = user;

    res.status(statusCode).json({
      status: 'success',
      token,
      // timeExpire: cookieOptions.expires.getTime(),
      user: rest,
    });
  }
  async loginService(loginService: LoginService, res: Response) {
    try {
      const user = await this.userRespository.findOne({
        where: [
          { email: loginService.account },
          { phone: loginService.account },
        ],
      });
      if (
        !user ||
        !(await bcrypt.compare(loginService.password, user.password))
      ) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          status: 'error',
          message: 'Your account or Password in correct !',
        });
      }

      this.createSendToken(user, 200, res);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: 'error',
        message: err.message,
      });
    }
  }

  async logoutService(req: Request, res: Response) {
    try {
      const createBlackList = this.tokenBlackListRespository.create({
        token: req.headers.authorization.split(' ')[1],
      });
      await this.tokenBlackListRespository.save(createBlackList);
      return res.status(HttpStatus.OK).json({
        status: 'success',
        message: 'Logout successfully !',
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: 'error',
        message: err.message,
      });
    }
  }

  async updateProfileService(
    updateUser: UpdateProfile,
    file: Express.Multer.File,
    req: Request,
    res: Response,
  ) {
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
        const result: any = await new Promise((resolve, reject) => {
          v2.uploader
            .upload_stream(
              {
                folder: 'my_image_user',
                public_id: originalname.split('.')[0],
                resource_type: 'image',
              },
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(result);
                }
              },
            )
            .end(buffer);
        });
        user.photo = result.url;
      }
      await this.userRespository.save(user);
      const { password, ...rest } = user;
      return res.status(200).json({
        status: 'success',
        user: rest,
      });
    } catch (err) {
      return res.status(400).json({
        status: 'error',
        message: err.message,
      });
    }
  }

  async forgotPasswordService(forgotPasswordService: string, res: Response) {
    const account = await this.userRespository.findOneOrFail({
      where: { email: forgotPasswordService },
    });
    try {
      if (!account) {
        throw new HttpException(
          { message: 'No account have this email', status: 'error' },
          HttpStatus.NOT_FOUND,
        );
      }
      if (account.googleId) {
        throw new HttpException(
          {
            message:
              'This account sign in via google, please log back in with your google account',
            status: 'error',
          },
          HttpStatus.BAD_REQUEST,
        );
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
            HTMLPart: `<h3>Hello ${
              account.name
            },</h3><p>You have requested to change your password on AMAZON shop. Please visit the change password page and follow the instructions to complete the process.<br /> <a href="${this.configService.get(
              'FRONTEND_URL',
            )}/account/user/resetPassword/${resetToken}">At here !</a> </p><p>Sincerely,</p><p>AMAZON</p>`,
          },
        ],
      });
      return res.status(HttpStatus.OK).json({
        status: 'success',
        message: 'email sent',
      });
    } catch (err) {
      account.passwordResetToken = null;
      account.passwordResetExpire = null;
      await this.userRespository.save(account);
      throw new HttpException(
        {
          message: 'AMAZON system has some error , please comback later',
          status: 'error',
          description: err,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async resetPasswordViaEmail(
    tokenService: string,
    resetPassword: ResetPasswordService,
    res: Response,
  ) {
    try {
      if (resetPassword.password !== resetPassword.passwordConfirm) {
        throw new HttpException(
          {
            status: 'error',
            message: 'Password and password confirm must be match !',
          },
          HttpStatus.NOT_ACCEPTABLE,
        );
      }
      const hashedToken = crypto
        .createHash('sha256')
        .update(tokenService)
        .digest('hex');
      const account = await this.userRespository.findOne({
        where: {
          passwordResetToken: hashedToken,
          passwordResetExpire: MoreThan(new Date(Date.now())),
        },
      });

      if (!account) {
        throw new HttpException(
          { status: 'error', message: 'This reset code has expired' },
          HttpStatus.NOT_FOUND,
        );
      }
      account.setPassword(resetPassword.password);
      account.passwordResetToken = null;
      account.passwordResetExpire = null;

      await this.userRespository.save(account);
      res.status(HttpStatus.OK).json({
        status: 'success',
      });
    } catch (err) {
      throw new HttpException(
        {
          message: 'Some thing when wrong , please try again !',
          status: 'error',
          description: err,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updatePassword(
    updatePasswordService: UpdatePasswordService,
    res: Response,
    req: Request,
  ) {
    try {
      const account = await this.userRespository.findOne({
        where: { _id: req['user']._id },
      });
      if (!account) {
        res.status(HttpStatus.NOT_FOUND).json({
          status: 'error',
          message: 'This account is not exist , please try again !',
        });
      }
      if (
        !(await bcrypt.compare(
          updatePasswordService.passwordCurrent,
          account.password,
        ))
      ) {
        res.status(HttpStatus.NOT_ACCEPTABLE).json({
          status: 'error',
          message: 'Your current password is wrong !',
        });
      }
      if (
        updatePasswordService.password !== updatePasswordService.passwordConfirm
      ) {
        res.status(HttpStatus.NOT_ACCEPTABLE).json({
          status: 'error',
          message: 'Password and password confirm must be match !',
        });
      }
      account.setPassword(updatePasswordService.password);
      await this.userRespository.save(account);
      const { password, ...rest } = account;
      res.cookie('jwt', 'tuyendeptrai', {
        expires: new Date(Date.now()),
        httpOnly: true,
      });
      res.status(200).json({
        status: 'success',
        user: rest,
      });
    } catch (err) {
      throw new HttpException(
        {
          status: 'error',
          message: 'Server side problem , we will fix it quickly , sorry !',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async sendOtp(phoneNumberService: string, res: Response, req: Request) {
    const account = await this.userRespository.findOneOrFail({
      where: { _id: req['user']._id },
    });
    try {
      if (!account) {
        throw new HttpException(
          { status: 'error', message: 'Not found this account' },
          HttpStatus.NOT_FOUND,
        );
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

      res.status(HttpStatus.OK).json({
        status: 'success',
        message: 'Otp is sent',
      });
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: 'error',
        message: err.message,
      });
    }
  }

  async updatePhoneService(
    newPhone: string,
    otp: string,
    res: Response,
    req: Request,
  ) {
    try {
      const account = await this.userRespository.findOne({
        where: { _id: req['user']._id },
      });
      if (account.otp === otp && account.otpExpire > new Date(Date.now())) {
        account.otp = null;
        account.otpExpire = null;
        account.phone = newPhone;
        await this.userRespository.save(account);
        const { password, ...rest } = account;
        res.status(200).json({
          status: 'success',
          message: 'thay đổi sdt thành công',
          user: rest,
        });
      } else {
        res.status(HttpStatus.NOT_ACCEPTABLE).json({ message: 'Invalid OTP' });
      }
    } catch (err) {
      throw new HttpException(
        {
          status: 'error',
          message: 'Server side problem , we will fix it quickly , sorry !',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async resetPasswordBasePhoneService(
    phone: string,
    res: Response,
    req: Request,
  ) {
    try {
      const account = await this.userRespository.findOne({
        where: { phone: phone },
      });
      if (!account) {
        res.status(HttpStatus.NOT_FOUND).json({
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
    } catch (err) {
      console.log(err);
      throw new HttpException(
        {
          status: 'error',
          message: 'Server side problem , we will fix it quickly , sorry !',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async verifyEmailService(email: string, req: Request, res: Response) {
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
    } catch (err) {
      return res.status(400).json({
        status: 'error',
        message: err.message,
      });
    }
  }

  async changeEmailService(mailOtp: string, req: Request, res: Response) {
    try {
      var user = await this.userRespository.findOne({
        where: {
          _id: req['user']._id,
          emailToken: mailOtp,
          mailTokenExpire: MoreThan(new Date(Date.now())),
        },
      });
      if (!user) {
        throw new Error('This otp has expired');
      }
      user.emailToken = null;
      user.mailTokenExpire = null;
      user.verified = true;

      await this.userRespository.save(user);
      const { password, ...rest } = user;
      return res.status(200).json({
        status: 'success',
        message: 'Email verified',
        user: rest,
      });
    } catch (err) {
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

  async updateEmailService(newEmail: string, req: Request, res: Response) {
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
      const { password, ...rest } = user;
      return res.status(200).json({
        status: 'success',
        user: rest,
      });
    } catch (err) {
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
}
