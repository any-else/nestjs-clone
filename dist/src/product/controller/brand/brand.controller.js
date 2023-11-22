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
exports.BrandController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const CreateBrand_dto_1 = require("../../../dtos/CreateBrand.dto");
const int_transform_1 = require("../../../pipe/int.transform");
const brand_service_1 = require("../../service/brand/brand.service");
let BrandController = class BrandController {
    constructor(brandService) {
        this.brandService = brandService;
    }
    getBrandCollection(idCollection, res) {
        return this.brandService.getBrandCollection(idCollection, res);
    }
    getAllBrands(res) {
        return this.brandService.findBrands(res);
    }
    createBrand(createBrandDto, req, res) {
        return this.brandService.createBrand(createBrandDto, res, req);
    }
    findOneBrand(idBrand, res) {
        return this.brandService.findOneBrandSerivice(idBrand, res);
    }
    updateBrand(idBrand, updateBrandDto, file, res) {
        return this.brandService.updateBrand(idBrand, updateBrandDto, file, res);
    }
    deleteBrand(idBrand, res) {
        return this.brandService.deleteBrand(idBrand, res);
    }
};
__decorate([
    (0, common_1.Get)('brand-collection'),
    __param(0, (0, common_1.Query)('idCollection', int_transform_1.OptionalParseIntPipe)),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], BrandController.prototype, "getBrandCollection", null);
__decorate([
    (0, common_1.Get)(''),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BrandController.prototype, "getAllBrands", null);
__decorate([
    (0, common_1.Post)(''),
    (0, common_1.UseInterceptors)((0, platform_express_1.AnyFilesInterceptor)({
        storage: (0, multer_1.memoryStorage)(),
        fileFilter: (req, file, cb) => {
            if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|avif|AVIF|webp|WEBP)$/)) {
                req.fileValidationError = 'Only image files are allowed!';
                return cb(null, false);
            }
            else {
                cb(null, true);
            }
        },
    })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateBrand_dto_1.CreateBrand, Object, Object]),
    __metadata("design:returntype", void 0)
], BrandController.prototype, "createBrand", null);
__decorate([
    (0, common_1.Get)(':idBrand'),
    __param(0, (0, common_1.Param)('idBrand', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], BrandController.prototype, "findOneBrand", null);
__decorate([
    (0, common_1.Patch)(':idBrand'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image_brand', {
        storage: (0, multer_1.memoryStorage)(),
        fileFilter: (req, file, cb) => {
            if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|avif|AVIF|webp|WEBP)$/)) {
                req.fileValidationError = 'Only image files are allowed!';
                return cb(null, false);
            }
            else {
                cb(null, true);
            }
        },
    })),
    __param(0, (0, common_1.Param)('idBrand', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object, Object]),
    __metadata("design:returntype", void 0)
], BrandController.prototype, "updateBrand", null);
__decorate([
    (0, common_1.Delete)(':idBrand'),
    __param(0, (0, common_1.Param)('idBrand', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], BrandController.prototype, "deleteBrand", null);
BrandController = __decorate([
    (0, common_1.Controller)('brand'),
    __metadata("design:paramtypes", [brand_service_1.BrandService])
], BrandController);
exports.BrandController = BrandController;
//# sourceMappingURL=brand.controller.js.map