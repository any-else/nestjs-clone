"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModule = void 0;
const common_1 = require("@nestjs/common");
const product_controller_1 = require("./controller/product/product.controller");
const product_service_1 = require("./service/product/product.service");
const ProductVariant_entity_1 = require("../typeorm/entities/ProductVariant.entity");
const typeorm_1 = require("@nestjs/typeorm");
const Product_entity_1 = require("../typeorm/entities/Product.entity");
const category_controller_1 = require("./controller/category/category.controller");
const category_service_1 = require("./service/category/category.service");
const collection_controller_1 = require("./controller/collection/collection.controller");
const collection_service_1 = require("./service/collection/collection.service");
const Collection_entity_1 = require("../typeorm/entities/Collection.entity");
const Category_entity_1 = require("../typeorm/entities/Category.entity");
const color_controller_1 = require("./controller/color/color.controller");
const color_service_1 = require("./service/color/color.service");
const Color_entity_1 = require("../typeorm/entities/Color.entity");
const ImageShow_entity_1 = require("../typeorm/entities/ImageShow.entity");
const Size_entity_1 = require("../typeorm/entities/Size.entity");
const size_controller_1 = require("./controller/size/size.controller");
const size_service_1 = require("./service/size/size.service");
const nestjs_form_data_1 = require("nestjs-form-data");
const config_1 = require("@nestjs/config");
const nestjs_cloudinary_1 = require("nestjs-cloudinary");
const brand_controller_1 = require("./controller/brand/brand.controller");
const brand_service_1 = require("./service/brand/brand.service");
const Brand_entity_1 = require("../typeorm/entities/Brand.entity");
const ProductVariantSize_entity_1 = require("../typeorm/entities/ProductVariantSize.entity");
let ProductModule = class ProductModule {
};
ProductModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                ProductVariant_entity_1.ProductVariant,
                Product_entity_1.Product,
                Collection_entity_1.Collection,
                Category_entity_1.Category,
                Color_entity_1.Color,
                ImageShow_entity_1.ImageShow,
                Size_entity_1.Size,
                Brand_entity_1.Brand,
                ProductVariantSize_entity_1.ProductVariantSize,
            ]),
            nestjs_form_data_1.NestjsFormDataModule,
            nestjs_cloudinary_1.CloudinaryModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    isGlobal: true,
                    cloud_name: configService.get('CLOUD_NAME'),
                    api_key: configService.get('API_CLOUD_KEY'),
                    api_secret: configService.get('API_CLOUD_SECRET'),
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [
            product_controller_1.ProductController,
            category_controller_1.CategoryController,
            collection_controller_1.CollectionController,
            color_controller_1.ColorController,
            size_controller_1.SizeController,
            brand_controller_1.BrandController,
        ],
        providers: [
            product_service_1.ProductService,
            category_service_1.CategoryService,
            collection_service_1.CollectionService,
            color_service_1.ColorService,
            size_service_1.SizeService,
            brand_service_1.BrandService,
        ],
    })
], ProductModule);
exports.ProductModule = ProductModule;
//# sourceMappingURL=product.module.js.map