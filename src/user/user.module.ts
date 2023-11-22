import { Module } from '@nestjs/common';
import { UserController } from './controller/user/user.controller';
import { UserService } from './service/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User.entity';
import { TokenBlackList } from 'src/typeorm/entities/TokenBlackList.entity';
@Module({
  imports: [TypeOrmModule.forFeature([User, TokenBlackList])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
