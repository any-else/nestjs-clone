import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import Stripe from 'stripe';
import * as paypal from 'paypal-rest-sdk';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Booking,
  BookingStatus,
  Order,
} from 'src/typeorm/entities/Booking.entity';
import { Repository } from 'typeorm';
import { ProductVariantSize } from 'src/typeorm/entities/ProductVariantSize.entity';
import { User } from 'src/typeorm/entities/User.entity';
import { inforBooking } from 'src/types/types';
import { Cart } from 'src/typeorm/entities/Cart.entity';
import { Role } from 'src/types/role.enum';

@Injectable()
export class BookingService {
  private stripe: Stripe;
  constructor(
    private configService: ConfigService,
    @InjectRepository(Booking) private bookingRepository: Repository<Booking>,
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(BookingStatus)
    private statusRepository: Repository<BookingStatus>,
    @InjectRepository(ProductVariantSize)
    private productVariantSizeRepository: Repository<ProductVariantSize>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
  ) {
    this.stripe = new Stripe(configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2022-11-15',
    });
    paypal.configure({
      mode: 'sandbox',
      client_id: configService.get('API_PAYPAL_PUBLIC'),
      client_secret: configService.get('API_PAYPAL_SECRET'),
    });
  }

  async createStatus(statusName: string, res: Response) {
    try {
      const newStatus = this.statusRepository.create({
        name: statusName,
      });
      const saveStatus = await this.statusRepository.save(newStatus);
      return res.status(200).json({
        status: 'success',
        message: 'Create status success',
        data: saveStatus,
      });
    } catch (err) {
      return res.status(400).json({
        status: 'error',
        message: err.message,
      });
    }
  }

  async getStatus(res: Response) {
    try {
      const status = await this.statusRepository.find();
      console.log(status);

      return res.status(200).json({
        status: 'success',
        message: 'Get status success',
        data: status,
      });
    } catch (err) {
      console.log(err);

      return res.status(400).json({
        status: 'error',
        message: err.message,
      });
    }
  }

  async createBookingCod(
    orders: { quantity: number; idProd: number }[],
    infor: inforBooking,
    req: Request,
    res: Response,
  ) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          _id: req['user']._id,
        },
      });
      if (!user) {
        throw new Error('Not found this user');
      }
      const saveStatus = await this.statusRepository.findOne({
        where: {
          name: 'Processing',
        },
      });
      const createBooking = this.bookingRepository.create({
        country: infor.country,
        first_name: infor.first_name,
        last_name: infor.last_name,
        address: infor.address,
        apartment: infor.apartment,
        city: infor.city,
        postal_code: infor.postal_code,
        phone: infor.phone,
        email: infor.email,
        user: user,
        status: saveStatus,
      });
      const saveBooking = await this.bookingRepository.save(createBooking);
      for (let i = 0; i < orders.length; i++) {
        let checkProdSize = await this.productVariantSizeRepository.findOne({
          relations: {
            size: true,
            prod_variant: {
              product: true,
            },
          },
          where: {
            _id: orders[i].idProd,
          },
        });
        if (!checkProdSize) {
          await this.bookingRepository.delete({ _id: saveBooking._id });

          throw new Error('Not found this product');
        }
        const createOrder = this.orderRepository.create({
          quantity: orders[i].quantity,
          product: checkProdSize,
          bookings: saveBooking,
        });
        const saveOrder = await this.orderRepository.save(createOrder);
      }
      const orderTotals = await this.orderRepository.find({
        relations: {
          product: true,
          bookings: true,
        },
        where: {
          bookings: {
            _id: saveBooking._id,
          },
        },
      });
      let total = 0;
      for (let i = 0; i < orderTotals.length; i++) {
        total += orderTotals[i].product.new_price * orderTotals[i].quantity;
      }
      saveBooking.total = total;
      saveBooking.payment_method = 'COD';
      await this.bookingRepository.save(saveBooking);

      const cart = await this.cartRepository.findOne({
        relations: {
          user: true,
        },
        where: {
          user: {
            _id: user._id,
          },
        },
      });
      await this.cartRepository.remove(cart);
      return res.status(200).json({
        status: 'success',
        message: 'Create booking success',
      });
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        status: 'error',
        message: err.message,
      });
    }
  }

  async charge(
    orders: { quantity: number; idProd: number }[],
    infor: inforBooking,
    req: Request,
    res: Response,
  ) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          _id: req['user']._id,
        },
      });
      if (!user) {
        throw new Error('Not found this user');
      }
      const saveStatus = await this.statusRepository.findOne({
        where: {
          name: 'Unpaid',
        },
      });
      const createBooking = this.bookingRepository.create({
        country: infor.country,
        first_name: infor.first_name,
        last_name: infor.last_name,
        address: infor.address,
        apartment: infor.apartment,
        city: infor.city,
        postal_code: infor.postal_code,
        phone: infor.phone,
        email: infor.email,
        user: user,
        status: saveStatus,
      });
      const saveBooking = await this.bookingRepository.save(createBooking);
      let line_items = [];
      for (let i = 0; i < orders.length; i++) {
        let checkProdSize = await this.productVariantSizeRepository.findOne({
          relations: {
            size: true,
            prod_variant: {
              product: true,
            },
          },
          where: {
            _id: orders[i].idProd,
          },
        });
        if (!checkProdSize) {
          await this.bookingRepository.delete({ _id: saveBooking._id });

          throw new Error('Not found this product');
        }
        const createOrder = this.orderRepository.create({
          quantity: orders[i].quantity,
          product: checkProdSize,
          bookings: saveBooking,
        });
        const saveOrder = await this.orderRepository.save(createOrder);

        line_items.push({
          price_data: {
            currency: 'usd',
            product_data: {
              name: checkProdSize.prod_variant.product.name,
              images: [checkProdSize.prod_variant.product.product_image],
              description: checkProdSize.prod_variant.product.description,
            },
            unit_amount: checkProdSize.new_price * 100,
          },
          quantity: orders[i].quantity,
        });
      }
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: line_items,
        mode: 'payment',
        success_url:
          'http://localhost:3000' + '/success?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: 'http://localhost:3000' + '/failed',
      });

      saveBooking.transaction_id = session.id;
      const orderTotals = await this.orderRepository.find({
        relations: {
          product: true,
          bookings: true,
        },
        where: {
          bookings: {
            _id: saveBooking._id,
          },
        },
      });
      let total = 0;
      for (let i = 0; i < orderTotals.length; i++) {
        total += orderTotals[i].product.new_price * orderTotals[i].quantity;
      }
      saveBooking.total = total;
      await this.bookingRepository.save(saveBooking);

      return res.status(200).json({
        status: 'success',
        url: session.url,
      });
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        status: 'error',
        message: err.message,
      });
    }
  }

  async check(id: string, res: Response) {
    try {
      const result = await this.stripe.checkout.sessions.retrieve(id);
      const paymentIntent: Stripe.PaymentIntent =
        await this.stripe.paymentIntents.retrieve(
          result.payment_intent.toString(),
          {
            expand: ['customer'],
          },
        );
      const paymentMethod: Stripe.PaymentMethod =
        await this.stripe.paymentMethods.retrieve(
          paymentIntent.payment_method.toString(),
          {
            expand: ['customer'],
          },
        );
      const booking = await this.bookingRepository.findOne({
        relations: {
          user: true,
        },
        where: {
          transaction_id: id,
        },
      });

      booking.brand = paymentMethod.card.brand;
      booking.payment_method = paymentMethod.type;
      const booking_status = await this.statusRepository.findOne({
        where: {
          name: 'Paid',
        },
      });
      const booking_status_failed = await this.statusRepository.findOne({
        where: {
          name: 'Cancelled',
        },
      });
      if (paymentIntent.status === 'succeeded') {
        booking.status = booking_status;
        await this.cartRepository.delete({ user: { _id: booking.user._id } });
      } else {
        booking.status = booking_status_failed;
      }
      await this.bookingRepository.save(booking);
      return res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (err) {
      console.log(err);
    }
  }

  async findOrders(idStatus: number, req: Request, res: Response) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          _id: req['user']._id,
        },
      });
      if (!user) {
        throw new Error('Not found this user');
      }
      const bookings = await this.bookingRepository.find({
        relations: {
          user: true,
          order: {
            product: {
              size: true,
              prod_variant: {
                product: true,
                color: true,
              },
            },
          },
          status: true,
        },
        where: {
          user: {
            _id: user._id,
          },
          status: idStatus
            ? {
                _id: idStatus,
              }
            : {},
        },
      });
      return res.status(200).json({
        status: 'success',
        bookings,
      });
    } catch (err) {
      return res.status(400).json({
        status: 'error',
        message: err.message,
      });
    }
  }

  async findOrdersAllUsers(idStatus: number, res: Response) {
    try {
      const bookings = await this.bookingRepository.find({
        relations: {
          user: true,
          order: {
            product: {
              size: true,
              prod_variant: {
                product: true,
                color: true,
              },
            },
          },
          status: true,
        },
        where: {
          status: idStatus
            ? {
                _id: idStatus,
              }
            : {},
        },
      });
      return res.status(200).json({
        status: 'success',
        bookings,
      });
    } catch (err) {
      return res.status(400).json({
        status: 'error',
        message: err.message,
      });
    }
  }

  async findBookingById(idBooking: number, req: Request, res: Response) {
    try {
      const booking = await this.bookingRepository.findOne({
        relations: {
          user: true,
          order: {
            product: {
              size: true,
              prod_variant: {
                product: true,
                color: true,
              },
            },
          },
          status: true,
        },
        where: {
          _id: idBooking,
        },
      });

      return res.status(200).json({
        status: 'success',
        booking,
      });
    } catch (err) {
      return res.status(400).json({
        status: 'error',
        message: err.message,
      });
    }
  }

  async updateStatusService(
    idBooking: number,
    idStatus: number,
    res: Response,
  ) {
    try {
      const booking = await this.bookingRepository.findOne({
        relations: {
          user: true,
          status: true,
        },
        where: {
          _id: idBooking,
        },
      });
      if (!booking) {
        throw new Error('Not found this booking');
      }
      const status = await this.statusRepository.findOne({
        where: {
          _id: idStatus,
        },
      });
      if (!status) {
        throw new Error('Not found this status');
      }

      booking.status = status;
      const resultSave = await this.bookingRepository.save(booking);
      if (status.name === 'Completed' || status.name === 'Paid') {
        const orders = await this.orderRepository.find({
          relations: {
            product: {
              size: true,
            },
          },
          where: {
            bookings: {
              _id: resultSave._id,
            },
          },
        });
        for (let i = 0; i < orders.length; i++) {
          await this.productVariantSizeRepository.update(
            orders[i].product._id,
            {
              quantity: orders[i].product.quantity - orders[i].quantity,
            },
          );
        }
      }
      return res.status(200).json({
        status: 'success',
      });
    } catch (err) {
      return res.status(400).json({
        status: 'error',
        message: err.message,
      });
    }
  }

  async getBookingByUser(idUser: number, idStatus: number, res: Response) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          _id: idUser,
        },
      });
      if (!user) {
        throw new Error('Not found this user');
      }
      const bookings = await this.bookingRepository.find({
        relations: {
          user: true,
          order: {
            product: {
              size: true,
              prod_variant: {
                product: true,
                color: true,
              },
            },
          },
          status: true,
        },
        where: {
          user: {
            _id: user._id,
          },
          status: idStatus
            ? {
                _id: idStatus,
              }
            : {},
        },
      });

      return res.status(200).json({
        status: 'success',
        bookings,
      });
    } catch (err) {
      return res.status(400).json({
        status: 'error',
        message: err.message,
      });
    }
  }
}
