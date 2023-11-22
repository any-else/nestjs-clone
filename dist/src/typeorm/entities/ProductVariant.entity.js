"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductVariant = void 0;
const typeorm_1 = require("typeorm");
const Product_entity_1 = require("./Product.entity");
const Color_entity_1 = require("./Color.entity");
const ImageShow_entity_1 = require("./ImageShow.entity");
const ProductVariantSize_entity_1 = require("./ProductVariantSize.entity");
let ProductVariant = class ProductVariant {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", Number)
], ProductVariant.prototype, "_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Product_entity_1.Product, (prod) => prod.prod_variant, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", Product_entity_1.Product)
], ProductVariant.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ProductVariantSize_entity_1.ProductVariantSize, (prod) => prod.prod_variant, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", Array)
], ProductVariant.prototype, "product_variant_size", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Color_entity_1.Color, (color) => color.prod_variant, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'color_id' }),
    __metadata("design:type", Color_entity_1.Color)
], ProductVariant.prototype, "color", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ImageShow_entity_1.ImageShow, (imageshow) => imageshow.product_variant, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", Array)
], ProductVariant.prototype, "image_shows", void 0);
ProductVariant = __decorate([
    (0, typeorm_1.Entity)({ name: 'products_variant' })
], ProductVariant);
exports.ProductVariant = ProductVariant;
//# sourceMappingURL=ProductVariant.entity.js.map