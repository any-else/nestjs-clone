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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const Cart_entity_1 = require("./Cart.entity");
const Booking_entity_1 = require("./Booking.entity");
const Blog_entity_1 = require("./Blog.entity");
let User = class User {
    constructor() {
        this.isPasswordChanged = false;
    }
    async hashPasswordBeforeSave() {
        this.password = await bcrypt.hash(this.password, 12);
    }
    async hashPassword() {
        if (this.isPasswordChanged) {
            this.password = await bcrypt.hash(this.password, 12);
            this.passwordChangeAt = new Date(Date.now() - 1000);
        }
    }
    setPassword(password) {
        this.password = password;
        this.isPasswordChanged = true;
    }
    changedPasswordAfter(JWTTimestamp) {
        if (this.passwordChangeAt) {
            const changedTimestamp = this.passwordChangeAt.getTime() / 1000;
            return JWTTimestamp < changedTimestamp;
        }
        return false;
    }
    createPasswordResetToken() {
        const resetToken = crypto.randomBytes(32).toString('hex');
        this.passwordResetToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        this.passwordResetExpire = new Date(Date.now() + 10 * 60 * 1000);
        return resetToken;
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", Number)
], User.prototype, "_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: false }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10, default: 'other' }),
    __metadata("design:type", String)
], User.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "birthday", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, unique: true, nullable: false }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10, unique: true, nullable: false }),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: false }),
    __metadata("design:type", String)
], User.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 50,
        default: 'user',
    }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 255,
        default: 'https://res.cloudinary.com/dalz888e7/image/upload/v1684910195/my_image_user/default-user.jpg.jpg',
    }),
    __metadata("design:type", String)
], User.prototype, "photo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: false }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "passwordChangeAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "passwordResetToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "passwordResetExpire", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "googleId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 8, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "otp", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "otpExpire", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "otpChangeAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "verified", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 8, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "emailToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "mailTokenExpire", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'datetime' }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Cart_entity_1.Cart, (cart) => cart.user, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", Cart_entity_1.Cart)
], User.prototype, "cart", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Booking_entity_1.Booking, (cart) => cart.user),
    __metadata("design:type", Array)
], User.prototype, "bookings", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Blog_entity_1.Blog, (blog) => blog.user, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", Array)
], User.prototype, "blogs", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], User.prototype, "hashPasswordBeforeSave", null);
__decorate([
    (0, typeorm_1.BeforeUpdate)(),
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], User.prototype, "hashPassword", null);
User = __decorate([
    (0, typeorm_1.Entity)({ name: 'users' })
], User);
exports.User = User;
//# sourceMappingURL=User.entity.js.map