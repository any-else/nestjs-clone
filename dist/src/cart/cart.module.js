"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartModule = void 0;
const common_1 = require("@nestjs/common");
const cart_controller_1 = require("./controller/cart/cart.controller");
const cart_service_1 = require("./service/cart/cart.service");
const Cart_entity_1 = require("../typeorm/entities/Cart.entity");
const typeorm_1 = require("@nestjs/typeorm");
const ProductVariantSize_entity_1 = require("../typeorm/entities/ProductVariantSize.entity");
const User_entity_1 = require("../typeorm/entities/User.entity");
const CartProd_entity_1 = require("../typeorm/entities/CartProd.entity");
const Product_entity_1 = require("../typeorm/entities/Product.entity");
const TokenBlackList_entity_1 = require("../typeorm/entities/TokenBlackList.entity");
let CartModule = class CartModule {
};
CartModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                Cart_entity_1.Cart,
                ProductVariantSize_entity_1.ProductVariantSize,
                User_entity_1.User,
                CartProd_entity_1.CartProd,
                Product_entity_1.Product,
                TokenBlackList_entity_1.TokenBlackList,
            ]),
        ],
        controllers: [cart_controller_1.CartController],
        providers: [cart_service_1.CartService],
    })
], CartModule);
exports.CartModule = CartModule;
//# sourceMappingURL=cart.module.js.map