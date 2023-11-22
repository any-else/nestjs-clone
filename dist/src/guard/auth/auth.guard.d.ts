import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/typeorm/entities/User.entity';
import { Repository } from 'typeorm';
import { Reflector } from '@nestjs/core';
import { TokenBlackList } from 'src/typeorm/entities/TokenBlackList.entity';
export declare class AuthGuard implements CanActivate {
    private jwtService;
    private userRespository;
    private tokenBlackListRespository;
    private reflector;
    constructor(jwtService: JwtService, userRespository: Repository<User>, tokenBlackListRespository: Repository<TokenBlackList>, reflector: Reflector);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
