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
exports.ColorController = void 0;
const common_1 = require("@nestjs/common");
const CreateColor_dto_1 = require("../../../dtos/CreateColor.dto");
const UpdateColor_dto_1 = require("../../../dtos/UpdateColor.dto");
const int_transform_1 = require("../../../pipe/int.transform");
const color_service_1 = require("../../service/color/color.service");
let ColorController = class ColorController {
    constructor(colorService) {
        this.colorService = colorService;
    }
    getAllColor(res) {
        return this.colorService.getAllColorService(res);
    }
    findColorCollection(idCollection, res) {
        return this.colorService.findColorCollection(idCollection, res);
    }
    createColor(createColorDto, res, req) {
        console.log(createColorDto);
        return this.colorService.createColor(createColorDto, res, req);
    }
    updateColor(id, updateColorDto, res) {
        return this.colorService.updateColor(id, updateColorDto, res);
    }
    deleteColor(id, res) {
        return this.colorService.deleteColor(id, res);
    }
    findOneColor(id, res) {
        return this.colorService.findOneColorService(id, res);
    }
};
__decorate([
    (0, common_1.Get)(''),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ColorController.prototype, "getAllColor", null);
__decorate([
    (0, common_1.Get)('color-collection'),
    __param(0, (0, common_1.Query)('idCollection', int_transform_1.OptionalParseIntPipe)),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ColorController.prototype, "findColorCollection", null);
__decorate([
    (0, common_1.Post)(''),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateColor_dto_1.CreateColor, Object, Object]),
    __metadata("design:returntype", void 0)
], ColorController.prototype, "createColor", null);
__decorate([
    (0, common_1.Patch)(':colorId'),
    __param(0, (0, common_1.Param)('colorId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, UpdateColor_dto_1.UpdateColor, Object]),
    __metadata("design:returntype", void 0)
], ColorController.prototype, "updateColor", null);
__decorate([
    (0, common_1.Delete)(':colorId'),
    __param(0, (0, common_1.Param)('colorId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ColorController.prototype, "deleteColor", null);
__decorate([
    (0, common_1.Get)(':idColor'),
    __param(0, (0, common_1.Param)('idColor', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ColorController.prototype, "findOneColor", null);
ColorController = __decorate([
    (0, common_1.Controller)('color'),
    __metadata("design:paramtypes", [color_service_1.ColorService])
], ColorController);
exports.ColorController = ColorController;
//# sourceMappingURL=color.controller.js.map