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
exports.SizeController = void 0;
const common_1 = require("@nestjs/common");
const CreateSize_dto_1 = require("../../../dtos/CreateSize.dto");
const UpdateSize_dto_1 = require("../../../dtos/UpdateSize.dto");
const int_transform_1 = require("../../../pipe/int.transform");
const size_service_1 = require("../../service/size/size.service");
let SizeController = class SizeController {
    constructor(sizeService) {
        this.sizeService = sizeService;
    }
    getSizeCollection(idCollection, res) {
        return this.sizeService.getSizeCollection(idCollection, res);
    }
    getAllSize(res) {
        return this.sizeService.findAllSizeService(res);
    }
    createSize(createSizeDto, res) {
        return this.sizeService.createSizeService(createSizeDto, res);
    }
    findSize(id, res) {
        return this.sizeService.findEachSize(id, res);
    }
    updateSize(id, updateSizeDto, res) {
        return this.sizeService.updateSizeService(id, updateSizeDto, res);
    }
    deleteSize(id, res) {
        return this.sizeService.deleteSizeService(id, res);
    }
};
__decorate([
    (0, common_1.Get)('size-collection'),
    __param(0, (0, common_1.Query)('idCollection', int_transform_1.OptionalParseIntPipe)),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], SizeController.prototype, "getSizeCollection", null);
__decorate([
    (0, common_1.Get)(''),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SizeController.prototype, "getAllSize", null);
__decorate([
    (0, common_1.Post)(''),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateSize_dto_1.CreateSize, Object]),
    __metadata("design:returntype", void 0)
], SizeController.prototype, "createSize", null);
__decorate([
    (0, common_1.Get)(':idSize'),
    __param(0, (0, common_1.Param)('idSize', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], SizeController.prototype, "findSize", null);
__decorate([
    (0, common_1.Patch)(':idSize'),
    __param(0, (0, common_1.Param)('idSize', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, UpdateSize_dto_1.UpdateSizeDto, Object]),
    __metadata("design:returntype", void 0)
], SizeController.prototype, "updateSize", null);
__decorate([
    (0, common_1.Delete)(':idSize'),
    __param(0, (0, common_1.Param)('idSize', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], SizeController.prototype, "deleteSize", null);
SizeController = __decorate([
    (0, common_1.Controller)('size'),
    __metadata("design:paramtypes", [size_service_1.SizeService])
], SizeController);
exports.SizeController = SizeController;
//# sourceMappingURL=size.controller.js.map