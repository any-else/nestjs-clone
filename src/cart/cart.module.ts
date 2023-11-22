import { Module } from '@nestjs/common';
import { CartController } from './controller/cart/cart.controller';
import { CartService } from './service/cart/cart.service';
import { Cart } from 'src/typeorm/entities/Cart.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductVariantSize } from 'src/typeorm/entities/ProductVariantSize.entity';
import { User } from 'src/typeorm/entities/User.entity';
import { CartProd } from 'src/typeorm/entities/CartProd.entity';
import { Product } from 'src/typeorm/entities/Product.entity';
import { TokenBlackList } from 'src/typeorm/entities/TokenBlackList.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Cart,
      ProductVariantSize,
      User,
      CartProd,
      Product,
      TokenBlackList,
    ]),
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
