import { Module } from '@nestjs/common';
import { BookingController } from './controller/booking/booking.controller';
import { BookingService } from './service/booking/booking.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User.entity';
import {
  Booking,
  BookingStatus,
  Order,
} from 'src/typeorm/entities/Booking.entity';
import { ProductVariantSize } from 'src/typeorm/entities/ProductVariantSize.entity';
import { Cart } from 'src/typeorm/entities/Cart.entity';
import { TokenBlackList } from 'src/typeorm/entities/TokenBlackList.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Booking,
      BookingStatus,
      Order,
      ProductVariantSize,
      Cart,
      TokenBlackList,
    ]),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        STRIPE_SECRET_KEY: Joi.string(),
        STRIPE_CURRENCY: Joi.string(),
        FRONTEND_URL: Joi.string(),
      }),
    }),
  ],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
