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
exports.BookingService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const stripe_1 = require("stripe");
const paypal = require("paypal-rest-sdk");
const typeorm_1 = require("@nestjs/typeorm");
const Booking_entity_1 = require("../../../typeorm/entities/Booking.entity");
const typeorm_2 = require("typeorm");
const ProductVariantSize_entity_1 = require("../../../typeorm/entities/ProductVariantSize.entity");
const User_entity_1 = require("../../../typeorm/entities/User.entity");
const Cart_entity_1 = require("../../../typeorm/entities/Cart.entity");
let BookingService = class BookingService {
    constructor(configService, bookingRepository, orderRepository, statusRepository, productVariantSizeRepository, userRepository, cartRepository) {
        this.configService = configService;
        this.bookingRepository = bookingRepository;
        this.orderRepository = orderRepository;
        this.statusRepository = statusRepository;
        this.productVariantSizeRepository = productVariantSizeRepository;
        this.userRepository = userRepository;
        this.cartRepository = cartRepository;
        this.stripe = new stripe_1.default(configService.get('STRIPE_SECRET_KEY'), {
            apiVersion: '2022-11-15',
        });
        paypal.configure({
            mode: 'sandbox',
            client_id: configService.get('API_PAYPAL_PUBLIC'),
            client_secret: configService.get('API_PAYPAL_SECRET'),
        });
    }
    async createStatus(statusName, res) {
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
        }
        catch (err) {
            return res.status(400).json({
                status: 'error',
                message: err.message,
            });
        }
    }
    async getStatus(res) {
        try {
            const status = await this.statusRepository.find();
            console.log(status);
            return res.status(200).json({
                status: 'success',
                message: 'Get status success',
                data: status,
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
    async createBookingCod(orders, infor, req, res) {
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
        }
        catch (err) {
            console.log(err);
            return res.status(400).json({
                status: 'error',
                message: err.message,
            });
        }
    }
    async charge(orders, infor, req, res) {
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
                success_url: 'http://localhost:3000' + '/success?session_id={CHECKOUT_SESSION_ID}',
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
        }
        catch (err) {
            console.log(err);
            return res.status(400).json({
                status: 'error',
                message: err.message,
            });
        }
    }
    async check(id, res) {
        try {
            const result = await this.stripe.checkout.sessions.retrieve(id);
            const paymentIntent = await this.stripe.paymentIntents.retrieve(result.payment_intent.toString(), {
                expand: ['customer'],
            });
            const paymentMethod = await this.stripe.paymentMethods.retrieve(paymentIntent.payment_method.toString(), {
                expand: ['customer'],
            });
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
            }
            else {
                booking.status = booking_status_failed;
            }
            await this.bookingRepository.save(booking);
            return res.status(200).json({
                status: 'success',
                data: result,
            });
        }
        catch (err) {
            console.log(err);
        }
    }
    async findOrders(idStatus, req, res) {
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
        }
        catch (err) {
            return res.status(400).json({
                status: 'error',
                message: err.message,
            });
        }
    }
    async findOrdersAllUsers(idStatus, res) {
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
        }
        catch (err) {
            return res.status(400).json({
                status: 'error',
                message: err.message,
            });
        }
    }
    async findBookingById(idBooking, req, res) {
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
        }
        catch (err) {
            return res.status(400).json({
                status: 'error',
                message: err.message,
            });
        }
    }
    async updateStatusService(idBooking, idStatus, res) {
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
                    await this.productVariantSizeRepository.update(orders[i].product._id, {
                        quantity: orders[i].product.quantity - orders[i].quantity,
                    });
                }
            }
            return res.status(200).json({
                status: 'success',
            });
        }
        catch (err) {
            return res.status(400).json({
                status: 'error',
                message: err.message,
            });
        }
    }
    async getBookingByUser(idUser, idStatus, res) {
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
        }
        catch (err) {
            return res.status(400).json({
                status: 'error',
                message: err.message,
            });
        }
    }
};
BookingService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(Booking_entity_1.Booking)),
    __param(2, (0, typeorm_1.InjectRepository)(Booking_entity_1.Order)),
    __param(3, (0, typeorm_1.InjectRepository)(Booking_entity_1.BookingStatus)),
    __param(4, (0, typeorm_1.InjectRepository)(ProductVariantSize_entity_1.ProductVariantSize)),
    __param(5, (0, typeorm_1.InjectRepository)(User_entity_1.User)),
    __param(6, (0, typeorm_1.InjectRepository)(Cart_entity_1.Cart)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], BookingService);
exports.BookingService = BookingService;
//# sourceMappingURL=booking.service.js.map