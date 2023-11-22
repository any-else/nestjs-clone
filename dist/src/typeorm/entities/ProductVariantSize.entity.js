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
exports.ProductVariantSize = void 0;
const typeorm_1 = require("typeorm");
const Size_entity_1 = require("./Size.entity");
const ProductVariant_entity_1 = require("./ProductVariant.entity");
const CartProd_entity_1 = require("./CartProd.entity");
const Booking_entity_1 = require("./Booking.entity");
let ProductVariantSize = class ProductVariantSize {
    calPrice() {
        const discount = this.price * (this.sale / 100);
        this.new_price = this.price - discount;
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", Number)
], ProductVariantSize.prototype, "_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Size_entity_1.Size, (size) => size.prod_variant_size, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'size_id' }),
    __metadata("design:type", Size_entity_1.Size)
], ProductVariantSize.prototype, "size", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ProductVariantSize.prototype, "sale", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint' }),
    __metadata("design:type", Number)
], ProductVariantSize.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], ProductVariantSize.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], ProductVariantSize.prototype, "new_price", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ProductVariant_entity_1.ProductVariant, (prod) => prod.product_variant_size, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'product_variant_id' }),
    __metadata("design:type", ProductVariant_entity_1.ProductVariant)
], ProductVariantSize.prototype, "prod_variant", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => CartProd_entity_1.CartProd, (cart) => cart.product, { onDelete: 'CASCADE' }),
    __metadata("design:type", Array)
], ProductVariantSize.prototype, "cart", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Booking_entity_1.Order, (order) => order.product, { onDelete: 'CASCADE' }),
    __metadata("design:type", Array)
], ProductVariantSize.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductVariantSize.prototype, "calPrice", null);
ProductVariantSize = __decorate([
    (0, typeorm_1.Entity)({ name: 'products_variant_size' })
], ProductVariantSize);
exports.ProductVariantSize = ProductVariantSize;
//# sourceMappingURL=ProductVariantSize.entity.js.map