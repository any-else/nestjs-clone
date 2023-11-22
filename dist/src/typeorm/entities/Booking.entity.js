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
exports.Order = exports.Booking = exports.BookingStatus = void 0;
const typeorm_1 = require("typeorm");
const User_entity_1 = require("./User.entity");
const ProductVariantSize_entity_1 = require("./ProductVariantSize.entity");
let BookingStatus = class BookingStatus {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], BookingStatus.prototype, "_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BookingStatus.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Booking, (booking) => booking.status, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", Array)
], BookingStatus.prototype, "bookings", void 0);
BookingStatus = __decorate([
    (0, typeorm_1.Entity)({ name: 'booking_status' })
], BookingStatus);
exports.BookingStatus = BookingStatus;
let Booking = class Booking {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Booking.prototype, "_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Booking.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Booking.prototype, "first_name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Booking.prototype, "last_name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Booking.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Booking.prototype, "apartment", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Booking.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Booking.prototype, "postal_code", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Booking.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Booking.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => BookingStatus, (status) => status.bookings, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'status_id' }),
    __metadata("design:type", BookingStatus)
], Booking.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_entity_1.User, (user) => user.bookings, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", User_entity_1.User)
], Booking.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Order, (order) => order.bookings, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", Array)
], Booking.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Booking.prototype, "total", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Booking.prototype, "payment_method", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Booking.prototype, "brand", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Booking.prototype, "transaction_id", void 0);
Booking = __decorate([
    (0, typeorm_1.Entity)({ name: 'bookings' })
], Booking);
exports.Booking = Booking;
let Order = class Order {
    calPrice() {
        this.new_price = this.product.new_price * this.quantity;
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Order.prototype, "_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Order.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ProductVariantSize_entity_1.ProductVariantSize, (product) => product.order, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'product_variant_id' }),
    __metadata("design:type", ProductVariantSize_entity_1.ProductVariantSize)
], Order.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Booking, (booking) => booking.order, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'booking_id' }),
    __metadata("design:type", Booking)
], Order.prototype, "bookings", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Order.prototype, "new_price", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'datetime' }),
    __metadata("design:type", Date)
], Order.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Order.prototype, "calPrice", null);
Order = __decorate([
    (0, typeorm_1.Entity)({ name: 'orders' })
], Order);
exports.Order = Order;
//# sourceMappingURL=Booking.entity.js.map