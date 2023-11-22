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
exports.BookingController = void 0;
const common_1 = require("@nestjs/common");
const booking_service_1 = require("../../service/booking/booking.service");
const roles_decorator_1 = require("../../../decorator/roles.decorator");
const CreateStatus_dto_1 = require("../../../dtos/CreateStatus.dto");
const CreateStripe_dto_1 = require("../../../dtos/CreateStripe.dto");
const auth_guard_1 = require("../../../guard/auth/auth.guard");
const int_transform_1 = require("../../../pipe/int.transform");
const role_enum_1 = require("../../../types/role.enum");
let BookingController = class BookingController {
    constructor(stripeService) {
        this.stripeService = stripeService;
    }
    createCharge(charge, request, response) {
        console.log(charge.orders);
        return this.stripeService.charge(charge.orders, charge.infor, request, response);
    }
    getAllOrders(res, idStatus) {
        return this.stripeService.findOrdersAllUsers(idStatus, res);
    }
    getBookingUser(idUser, res, idStatus) {
        return this.stripeService.getBookingByUser(idUser, idStatus, res);
    }
    stripeController(body, res) {
        return this.stripeService.check(body.id, res);
    }
    paypalController(charge, request, response) {
        return this.stripeService.createBookingCod(charge.orders, charge.infor, request, response);
    }
    statusController(body, res) {
        return this.stripeService.createStatus(body.name, res);
    }
    getStatusController(res) {
        return this.stripeService.getStatus(res);
    }
    getOrders(req, res, idStatus) {
        return this.stripeService.findOrders(idStatus, req, res);
    }
    findBookingById(idBooking, request, response) {
        return this.stripeService.findBookingById(idBooking, request, response);
    }
    changeStatus(idBooking, body, response) {
        return this.stripeService.updateStatusService(idBooking, body.idStatus, response);
    }
};
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateStripe_dto_1.CreateChargeDto, Object, Object]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "createCharge", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin),
    (0, common_1.Get)('get-all-orders'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)('idStatus', int_transform_1.OptionalParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "getAllOrders", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Admin),
    (0, common_1.Get)('get-booking-user/:idUser'),
    __param(0, (0, common_1.Param)('idUser')),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Query)('idStatus', int_transform_1.OptionalParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Number]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "getBookingUser", null);
__decorate([
    (0, common_1.Post)('stripe'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "stripeController", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('cod'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateStripe_dto_1.CreateChargeDto, Object, Object]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "paypalController", null);
__decorate([
    (0, common_1.Post)('status'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateStatus_dto_1.CreateStatus, Object]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "statusController", null);
__decorate([
    (0, common_1.Get)('status'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "getStatusController", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('orders'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Query)('idStatus', int_transform_1.OptionalParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Number]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "getOrders", null);
__decorate([
    (0, common_1.Get)(':idBooking'),
    __param(0, (0, common_1.Param)('idBooking')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "findBookingById", null);
__decorate([
    (0, common_1.Patch)(':idBooking'),
    __param(0, (0, common_1.Param)('idBooking')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", void 0)
], BookingController.prototype, "changeStatus", null);
BookingController = __decorate([
    (0, common_1.Controller)('booking'),
    __metadata("design:paramtypes", [booking_service_1.BookingService])
], BookingController);
exports.BookingController = BookingController;
//# sourceMappingURL=booking.controller.js.map