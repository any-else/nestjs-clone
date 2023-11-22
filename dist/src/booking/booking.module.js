"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingModule = void 0;
const common_1 = require("@nestjs/common");
const booking_controller_1 = require("./controller/booking/booking.controller");
const booking_service_1 = require("./service/booking/booking.service");
const config_1 = require("@nestjs/config");
const Joi = require("@hapi/joi");
const typeorm_1 = require("@nestjs/typeorm");
const User_entity_1 = require("../typeorm/entities/User.entity");
const Booking_entity_1 = require("../typeorm/entities/Booking.entity");
const ProductVariantSize_entity_1 = require("../typeorm/entities/ProductVariantSize.entity");
const Cart_entity_1 = require("../typeorm/entities/Cart.entity");
const TokenBlackList_entity_1 = require("../typeorm/entities/TokenBlackList.entity");
let BookingModule = class BookingModule {
};
BookingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                User_entity_1.User,
                Booking_entity_1.Booking,
                Booking_entity_1.BookingStatus,
                Booking_entity_1.Order,
                ProductVariantSize_entity_1.ProductVariantSize,
                Cart_entity_1.Cart,
                TokenBlackList_entity_1.TokenBlackList,
            ]),
            config_1.ConfigModule.forRoot({
                validationSchema: Joi.object({
                    STRIPE_SECRET_KEY: Joi.string(),
                    STRIPE_CURRENCY: Joi.string(),
                    FRONTEND_URL: Joi.string(),
                }),
            }),
        ],
        controllers: [booking_controller_1.BookingController],
        providers: [booking_service_1.BookingService],
    })
], BookingModule);
exports.BookingModule = BookingModule;
//# sourceMappingURL=booking.module.js.map