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
exports.Product = void 0;
const typeorm_1 = require("typeorm");
const Category_entity_1 = require("./Category.entity");
const ProductVariant_entity_1 = require("./ProductVariant.entity");
const slugify_1 = require("slugify");
const Brand_entity_1 = require("./Brand.entity");
let Product = class Product {
    updateSlug() {
        this.slug = (0, slugify_1.default)(this.name, { locale: 'vi', lower: true });
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", Number)
], Product.prototype, "_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: false, unique: true }),
    __metadata("design:type", String)
], Product.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: false }),
    __metadata("design:type", String)
], Product.prototype, "product_image", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Brand_entity_1.Brand, (brand) => brand.product, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'brand_id' }),
    __metadata("design:type", Brand_entity_1.Brand)
], Product.prototype, "brand", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Product.prototype, "available", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "material", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Category_entity_1.Category, (category) => category.products, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'category_id' }),
    __metadata("design:type", Category_entity_1.Category)
], Product.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ProductVariant_entity_1.ProductVariant, (prodVariant) => prodVariant.product, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", Array)
], Product.prototype, "prod_variant", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    (0, typeorm_1.BeforeUpdate)(),
    (0, typeorm_1.AfterInsert)(),
    (0, typeorm_1.AfterUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Product.prototype, "updateSlug", null);
Product = __decorate([
    (0, typeorm_1.Entity)({ name: 'products' })
], Product);
exports.Product = Product;
//# sourceMappingURL=Product.entity.js.map