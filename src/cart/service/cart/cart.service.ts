import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import { Cart } from 'src/typeorm/entities/Cart.entity';
import { CartProd } from 'src/typeorm/entities/CartProd.entity';
import { Product } from 'src/typeorm/entities/Product.entity';
import { ProductVariant } from 'src/typeorm/entities/ProductVariant.entity';
import { ProductVariantSize } from 'src/typeorm/entities/ProductVariantSize.entity';
import { User } from 'src/typeorm/entities/User.entity';
import { createCartService } from 'src/types/types';
import { Repository } from 'typeorm';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private cartRepository: Repository<Cart>,
    @InjectRepository(CartProd)
    private cartProdRepository: Repository<CartProd>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductVariantSize)
    private productVariantSize: Repository<ProductVariantSize>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createCartService(
    idProductVariantSize: createCartService,
    req: Request,
    res: Response,
  ) {
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
      } else {
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
        } else {
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
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        status: 'error',
        message: err.message,
      });
    }
  }

  async getCartMe(req: Request, res: Response) {
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
    } catch (err) {
      return res.status(400).json({
        status: 'error',
        message: err.message,
      });
    }
  }

  async inCartService(idCartProd: number, req: Request, res: Response) {
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
    } catch (err) {
      return res.status(400).json({
        status: 'error',
        message: err.message,
      });
    }
  }

  async decCartService(idCartProd: number, req: Request, res: Response) {
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
      } else cartProd.quantity -= 1;
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
    } catch (err) {
      return res.status(400).json({
        status: 'error',
        message: err.message,
      });
    }
  }

  async deleteEachItemService(idCartProd: number, req: Request, res: Response) {
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
    } catch (err) {
      return res.status(400).json({
        status: 'error',
        message: err.message,
      });
    }
  }
}
