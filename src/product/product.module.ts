import { Module } from '@nestjs/common';
import { ProductController } from './controller/product/product.controller';
import { ProductService } from './service/product/product.service';
import { ProductVariant } from 'src/typeorm/entities/ProductVariant.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/typeorm/entities/Product.entity';
import { CategoryController } from './controller/category/category.controller';
import { CategoryService } from './service/category/category.service';
import { CollectionController } from './controller/collection/collection.controller';
import { CollectionService } from './service/collection/collection.service';
import { Collection } from 'src/typeorm/entities/Collection.entity';
import { Category } from 'src/typeorm/entities/Category.entity';
import { ColorController } from './controller/color/color.controller';
import { ColorService } from './service/color/color.service';
import { Color } from 'src/typeorm/entities/Color.entity';
import { ImageShow } from 'src/typeorm/entities/ImageShow.entity';
import { Size } from 'src/typeorm/entities/Size.entity';
import { SizeController } from './controller/size/size.controller';
import { SizeService } from './service/size/size.service';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CloudinaryModule } from 'nestjs-cloudinary';
import { BrandController } from './controller/brand/brand.controller';
import { BrandService } from './service/brand/brand.service';
import { Brand } from 'src/typeorm/entities/Brand.entity';
import { ProductVariantSize } from 'src/typeorm/entities/ProductVariantSize.entity';
import { TokenBlackList } from 'src/typeorm/entities/TokenBlackList.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductVariant,
      Product,
      Collection,
      Category,
      Color,
      ImageShow,
      Size,
      Brand,
      ProductVariantSize,
    ]),
    NestjsFormDataModule,
    CloudinaryModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        isGlobal: true,
        cloud_name: configService.get('CLOUD_NAME'),
        api_key: configService.get('API_CLOUD_KEY'),
        api_secret: configService.get('API_CLOUD_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [
    ProductController,
    CategoryController,
    CollectionController,
    ColorController,
    SizeController,
    BrandController,
  ],
  providers: [
    ProductService,
    CategoryService,
    CollectionService,
    ColorService,
    SizeService,
    BrandService,
  ],
})
export class ProductModule {}
