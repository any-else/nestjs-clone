import { Module } from '@nestjs/common';
import { BlogController } from './controller/blog/blog.controller';
import { BlogService } from './service/blog/blog.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from 'src/typeorm/entities/Blog.entity';
import { User } from 'src/typeorm/entities/User.entity';
import { TokenBlackList } from 'src/typeorm/entities/TokenBlackList.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Blog, User, TokenBlackList])],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
