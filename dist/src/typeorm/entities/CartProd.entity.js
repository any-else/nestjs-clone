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
exports.CartProd = void 0;
const typeorm_1 = require("typeorm");
const ProductVariantSize_entity_1 = require("./ProductVariantSize.entity");
const Cart_entity_1 = require("./Cart.entity");
let CartProd = class CartProd {
    async calPrice() {
        this.price = this.quantity * this.product.new_price;
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", Number)
], CartProd.prototype, "_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ProductVariantSize_entity_1.ProductVariantSize, (prod) => prod.cart, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'product_variant_id' }),
    __metadata("design:type", ProductVariantSize_entity_1.ProductVariantSize)
], CartProd.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], CartProd.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], CartProd.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Cart_entity_1.Cart, (cart) => cart.cart_prod, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'cart_id' }),
    __metadata("design:type", Cart_entity_1.Cart)
], CartProd.prototype, "cart", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CartProd.prototype, "calPrice", null);
CartProd = __decorate([
    (0, typeorm_1.Entity)({ name: 'cart_prod' })
], CartProd);
exports.CartProd = CartProd;
//# sourceMappingURL=CartProd.entity.js.map