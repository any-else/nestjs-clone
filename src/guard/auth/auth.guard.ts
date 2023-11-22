import {
  CanActivate,
  ExecutionContext,
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { User } from 'src/typeorm/entities/User.entity';
import { Repository } from 'typeorm';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/types/role.enum';
import { ROLES_KEY } from 'src/decorator/roles.decorator';
import { TokenBlackList } from 'src/typeorm/entities/TokenBlackList.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private userRespository: Repository<User>,
    @InjectRepository(TokenBlackList)
    private tokenBlackListRespository: Repository<TokenBlackList>,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      let token: string;
      if (
        request.headers.authorization &&
        request.headers.authorization.startsWith('Bearer')
      ) {
        token = request.headers.authorization.split(' ')[1];
      }
      if (!token) {
        throw new HttpException(
          {
            message: 'You are not login , please login to access this link',
            status: 'unauthorized',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
      const checkToken = await this.tokenBlackListRespository.findOne({
        where: {
          token: token,
        },
      });
      if (checkToken) {
        throw new HttpException(
          {
            message: 'You are not login , please login to access this link',
            status: 'unauthorized',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      const payload = await this.jwtService.verifyAsync(token);
      const currentUser = await this.userRespository.findOne({
        where: { _id: payload.id },
      });
      if (!currentUser) {
        throw new HttpException(
          { message: 'This User is not exists', status: 'unauthorized' },
          HttpStatus.NOT_FOUND,
        );
      }
      if (currentUser.changedPasswordAfter(payload.iat)) {
        throw new HttpException(
          {
            message: 'Your account has changed, please login again',
            status: 'unauthorized',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      request['user'] = currentUser;
      const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );
      if (!requiredRoles) {
        return true;
      }
      return requiredRoles.some((role) => request['user'].role === role);
    } catch (err) {
      console.log(err);
      throw new HttpException(
        {
          message: err.message,
          status: 'unauthorized',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
