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
exports.ProductController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const CreateProduct_dto_1 = require("../../../dtos/CreateProduct.dto");
const UpdateProduct_dto_1 = require("../../../dtos/UpdateProduct.dto");
const boolean_transform_1 = require("../../../pipe/boolean.transform");
const int_transform_1 = require("../../../pipe/int.transform");
const parse_transform_1 = require("../../../pipe/parse.transform");
const product_service_1 = require("../../service/product/product.service");
let ProductController = class ProductController {
    constructor(productService) {
        this.productService = productService;
    }
    findAllController(idCategory, res) {
        return this.productService.findAllProductService(idCategory, res);
    }
    findLimitProduct(res) {
        return this.productService.findLimitProductService(res);
    }
    findBySlug(slug, res) {
        return this.productService.findEachBySlug(slug, res);
    }
    getProductCollection(idCollection, idColor, idSize, idBrand, idCategory, available, page, limit, res) {
        return this.productService.findProductCollection(idCollection, idColor, idSize, idBrand, idCategory, available, page, limit, res);
    }
    getEachProduct(idProduct, res) {
        return this.productService.findEachProduct(idProduct, res);
    }
    createProduct(createProductDto, res, req) {
        try {
            return this.productService.createProduct(createProductDto, res, req);
        }
        catch (err) {
            return res.status(400).json({
                status: 'error',
                message: err.message,
            });
        }
    }
    updateProduct(idProduct, updateProductDto, res, req) {
        return this.productService.updateProduct(idProduct, updateProductDto, res, req);
    }
    deleteProduct(idProduct, res) {
        return this.productService.deleteProduct(idProduct, res);
    }
    deleteProductVariant(idProduct, res) {
        return this.productService.deleteProductVariant(idProduct, res);
    }
    deleteProductVariantSize(idProduct, res) {
        return this.productService.deleteProductVariantSize(idProduct, res);
    }
    deleteImageSlideShow(idImageShow, res) {
        return this.productService.deleteImageSlideShow(idImageShow, res);
    }
};
__decorate([
    (0, common_1.Get)(':idCategory'),
    __param(0, (0, common_1.Param)('idCategory', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "findAllController", null);
__decorate([
    (0, common_1.Get)('limit-product/limit'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "findLimitProduct", null);
__decorate([
    (0, common_1.Get)('prod/:slug'),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "findBySlug", null);
__decorate([
    (0, common_1.Get)('product-collection/get'),
    __param(0, (0, common_1.Query)('idCollection', int_transform_1.OptionalParseIntPipe)),
    __param(1, (0, common_1.Query)('color', parse_transform_1.OptionalParseIntArrayPipe)),
    __param(2, (0, common_1.Query)('size', parse_transform_1.OptionalParseIntArrayPipe)),
    __param(3, (0, common_1.Query)('brand', parse_transform_1.OptionalParseIntArrayPipe)),
    __param(4, (0, common_1.Query)('category', parse_transform_1.OptionalParseIntArrayPipe)),
    __param(5, (0, common_1.Query)('available', boolean_transform_1.OptionalParseBooleanPipe)),
    __param(6, (0, common_1.Query)('page', int_transform_1.OptionalParseIntPipe)),
    __param(7, (0, common_1.Query)('limit', int_transform_1.OptionalParseIntPipe)),
    __param(8, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Array, Array, Array, Array, String, Number, Number, Object]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "getProductCollection", null);
__decorate([
    (0, common_1.Get)('get-each-product/:idProduct'),
    __param(0, (0, common_1.Param)('idProduct', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "getEachProduct", null);
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
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateProduct_dto_1.CreateProduct, Object, Object]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "createProduct", null);
__decorate([
    (0, common_1.Patch)('update/:idProduct'),
    (0, common_1.UseInterceptors)((0, platform_express_1.AnyFilesInterceptor)({
        storage: (0, multer_1.memoryStorage)(),
        fileFilter(req, file, cb) {
            if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|avif|AVIF|webp|WEBP)$/)) {
                req.fileValidationError = 'Only image files are allowed!';
                return cb(null, false);
            }
            cb(null, true);
        },
    })),
    __param(0, (0, common_1.Param)('idProduct', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, UpdateProduct_dto_1.UpdateProduct, Object, Object]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "updateProduct", null);
__decorate([
    (0, common_1.Delete)('delete/:idProduct'),
    __param(0, (0, common_1.Param)('idProduct', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "deleteProduct", null);
__decorate([
    (0, common_1.Delete)('delete-product-variant/:idProduct'),
    __param(0, (0, common_1.Param)('idProduct', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "deleteProductVariant", null);
__decorate([
    (0, common_1.Delete)('delete-product-variant-size/:idProduct'),
    __param(0, (0, common_1.Param)('idProduct', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "deleteProductVariantSize", null);
__decorate([
    (0, common_1.Delete)('delete-image-slide-show/:idImageShow'),
    __param(0, (0, common_1.Param)('idImageShow', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "deleteImageSlideShow", null);
ProductController = __decorate([
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [product_service_1.ProductService])
], ProductController);
exports.ProductController = ProductController;
//# sourceMappingURL=product.controller.js.map