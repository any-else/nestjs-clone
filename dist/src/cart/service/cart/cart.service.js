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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const Cart_entity_1 = require("../../../typeorm/entities/Cart.entity");
const CartProd_entity_1 = require("../../../typeorm/entities/CartProd.entity");
const Product_entity_1 = require("../../../typeorm/entities/Product.entity");
const ProductVariantSize_entity_1 = require("../../../typeorm/entities/ProductVariantSize.entity");
const User_entity_1 = require("../../../typeorm/entities/User.entity");
const typeorm_2 = require("typeorm");
let CartService = class CartService {
    constructor(cartRepository, cartProdRepository, productRepository, productVariantSize, userRepository) {
        this.cartRepository = cartRepository;
        this.cartProdRepository = cartProdRepository;
        this.productRepository = productRepository;
        this.productVariantSize = productVariantSize;
        this.userRepository = userRepository;
    }
    async createCartService(idProductVariantSize, req, res) {
        try {
            const productVariantSize = await this.productVariantSize.findOne({
                where: {
                    _id: idProductVariantSize.idProd,
                },
            });
            if (!productVariantSize) {
                throw new Error('Not found this product variant size');
            }
            const user = await this.userRepository.findOne({
                where: {
                    _id: req['user']._id,
                },
            });
            if (!user) {
                throw new Error('Not found this user');
            }
            let checkCart = await this.cartRepository.findOne({
                relations: {
                    user: true,
                    cart_prod: {
                        product: {
                            prod_variant: true,
                        },
                    },
                },
                where: {
                    user: {
                        _id: user._id,
                    },
                },
            });
            if (!checkCart) {
                const createCart = this.cartRepository.create({
                    user: user,
                });
                checkCart = await this.cartRepository.save(createCart);
                const cartProd = this.cartProdRepository.create({
                    quantity: idProductVariantSize.quantity,
                    product: productVariantSize,
                    cart: checkCart,
                });
                await this.cartProdRepository.save(cartProd);
            }
            else {
                let checkCartProd = await this.cartProdRepository.findOne({
                    relations: {
                        product: true,
                        cart: true,
                    },
                    where: {
                        cart: {
                            _id: checkCart._id,
                        },
                        product: {
                            _id: idProductVariantSize.idProd,
                        },
                    },
                });
                if (!checkCartProd) {
                    const cartProd = this.cartProdRepository.create({
                        quantity: idProductVariantSize.quantity,
                        product: productVariantSize,
                        cart: checkCart,
                    });
                    checkCartProd = await this.cartProdRepository.save(cartProd);
                    checkCart.cart_prod.push(cartProd);
                }
                else {
                    checkCartProd.quantity += idProductVariantSize.quantity;
                    await this.cartProdRepository.save(checkCartProd);
                }
            }
            await this.cartRepository.save(checkCart);
            const cartProds = await this.cartProdRepository.find({
                relations: {
                    product: true,
                    cart: {
                        user: true,
                    },
                },
                where: {
                    cart: {
                        _id: checkCart._id,
                    },
                },
            });
            let total = 0;
            for (let i = 0; i < cartProds.length; i++) {
                console.log(+cartProds[i].price);
                total += +cartProds[i].price;
            }
            checkCart.total = total;
            await this.cartRepository.save(checkCart);
            return res.status(201).json({
                status: 'success',
                message: 'Create cart success',
            });
        }
        catch (err) {
            console.log(err);
            return res.status(400).json({
                status: 'error',
                message: err.message,
            });
        }
    }
    async getCartMe(req, res) {
        try {
            const user = await this.userRepository.findOne({
                where: {
                    _id: req['user']._id,
                },
            });
            if (!user) {
                throw new Error('Not found this user');
            }
            let carts = await this.cartRepository.findOne({
                relations: {
                    cart_prod: {
                        product: {
                            size: true,
                            prod_variant: {
                                color: true,
                                product: true,
                            },
                        },
                    },
                },
                where: {
                    user: {
                        _id: user._id,
                    },
                },
            });
            return res.status(200).json({
                status: 'success',
                carts,
            });
        }
        catch (err) {
            return res.status(400).json({
                status: 'error',
                message: err.message,
            });
        }
    }
    async inCartService(idCartProd, req, res) {
        try {
            const user = await this.userRepository.findOne({
                where: {
                    _id: req['user']._id,
                },
            });
            const cartProd = await this.cartProdRepository.findOne({
                relations: {
                    product: true,
                    cart: {
                        cart_prod: true,
                        user: true,
                    },
                },
                where: {
                    _id: idCartProd,
                    cart: {
                        user: {
                            _id: user._id,
                        },
                    },
                },
            });
            if (!cartProd) {
                throw new Error('Not found this item in cart');
            }
            cartProd.quantity += 1;
            await this.cartProdRepository.save(cartProd);
            const cart = await this.cartRepository.findOne({
                relations: {
                    cart_prod: {
                        product: true,
                    },
                    user: true,
                },
                where: {
                    user: {
                        _id: user._id,
                    },
                },
            });
            const cartProds = await this.cartProdRepository.find({
                relations: {
                    product: true,
                    cart: {
                        user: true,
                    },
                },
                where: {
                    cart: {
                        _id: cart._id,
                    },
                },
            });
            let total = 0;
            for (let i = 0; i < cartProds.length; i++) {
                console.log(cartProds[i].product);
                total += +cartProds[i].price;
            }
            cart.total = total;
            await this.cartRepository.save(cart);
            return res.status(200).json({
                status: 'success',
                message: 'Update cart success',
            });
        }
        catch (err) {
            return res.status(400).json({
                status: 'error',
                message: err.message,
            });
        }
    }
    async decCartService(idCartProd, req, res) {
        try {
            const user = await this.userRepository.findOne({
                where: {
                    _id: req['user']._id,
                },
            });
            const cartProd = await this.cartProdRepository.findOne({
                relations: {
                    product: true,
                    cart: {
                        cart_prod: true,
                        user: true,
                    },
                },
                where: {
                    _id: idCartProd,
                    cart: {
                        user: {
                            _id: user._id,
                        },
                    },
                },
            });
            if (!cartProd) {
                throw new Error('Not found this item in cart');
            }
            if (cartProd.quantity <= 1) {
                cartProd.quantity = 1;
            }
            else
                cartProd.quantity -= 1;
            await this.cartProdRepository.save(cartProd);
            const cart = await this.cartRepository.findOne({
                relations: {
                    cart_prod: {
                        product: true,
                    },
                    user: true,
                },
                where: {
                    user: {
                        _id: user._id,
                    },
                },
            });
            const cartProds = await this.cartProdRepository.find({
                relations: {
                    product: true,
                    cart: {
                        user: true,
                    },
                },
                where: {
                    cart: {
                        _id: cart._id,
                    },
                },
            });
            let total = 0;
            for (let i = 0; i < cartProds.length; i++) {
                console.log(cartProds[i].product);
                total += +cartProds[i].price;
            }
            cart.total = total;
            await this.cartRepository.save(cart);
            return res.status(200).json({
                status: 'success',
                message: 'Update cart success',
            });
        }
        catch (err) {
            return res.status(400).json({
                status: 'error',
                message: err.message,
            });
        }
    }
    async deleteEachItemService(idCartProd, req, res) {
        try {
            const cart = await this.cartRepository.findOne({
                relations: {
                    cart_prod: {
                        product: true,
                    },
                    user: true,
                },
                where: {
                    user: {
                        _id: req['user']._id,
                    },
                },
            });
            const cartProd = await this.cartProdRepository.findOne({
                relations: {
                    cart: {
                        user: true,
                    },
                },
                where: {
                    _id: idCartProd,
                    cart: {
                        _id: cart._id,
                    },
                },
            });
            if (!cartProd) {
                throw new Error('Not found this item in cart');
            }
            await this.cartProdRepository.remove(cartProd);
            const cartProds = await this.cartProdRepository.find({
                relations: {
                    product: true,
                    cart: {
                        user: true,
                        cart_prod: true,
                    },
                },
                where: {
                    cart: {
                        _id: cartProd.cart._id,
                    },
                },
            });
            let total = 0;
            for (let i = 0; i < cartProds.length; i++) {
                total += +cartProds[i].price;
            }
            cart.total = total;
            await this.cartRepository.save(cart);
            return res.status(200).json({
                status: 'success',
                message: 'Delete cart success',
            });
        }
        catch (err) {
            return res.status(400).json({
                status: 'error',
                message: err.message,
            });
        }
    }
};
CartService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Cart_entity_1.Cart)),
    __param(1, (0, typeorm_1.InjectRepository)(CartProd_entity_1.CartProd)),
    __param(2, (0, typeorm_1.InjectRepository)(Product_entity_1.Product)),
    __param(3, (0, typeorm_1.InjectRepository)(ProductVariantSize_entity_1.ProductVariantSize)),
    __param(4, (0, typeorm_1.InjectRepository)(User_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CartService);
exports.CartService = CartService;
//# sourceMappingURL=cart.service.js.map