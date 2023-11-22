import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './typeorm/entities/User.entity';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import dataSource, { dataSourceOptions } from 'db/data-source';
import { ProductModule } from './product/product.module';
import { MiddlewareMiddleware } from './middleware/middleware.middleware';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CartController } from './cart/controller/cart/cart.controller';
import { CartService } from './cart/service/cart/cart.service';
import { CartModule } from './cart/cart.module';
import { BookingModule } from './booking/booking.module';
import { BlogModule } from './blog/blog.module';
@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
    UserModule,
    ProductModule,
    CartModule,
    ConfigModule.forRoot(),
    BookingModule,
    BlogModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(MiddlewareMiddleware)
  //     .forRoutes('products/create/:idCategory');
  // }
}
