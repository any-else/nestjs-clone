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
exports.CollectionController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const CreateCollection_dto_1 = require("../../../dtos/CreateCollection.dto");
const UpdateCollection_dto_1 = require("../../../dtos/UpdateCollection.dto");
const collection_service_1 = require("../../service/collection/collection.service");
let CollectionController = class CollectionController {
    constructor(collectionService) {
        this.collectionService = collectionService;
    }
    findAllCollection(res) {
        return this.collectionService.findAllCollectionService(res);
    }
    createCollection(createCollectionDto, res, req) {
        return this.collectionService.createCollectionService(createCollectionDto, res, req);
    }
    updateCollection(id, image_collection, updateCollectionDto, res) {
        console.log(updateCollectionDto);
        let parseObj = {
            collection_name: updateCollectionDto.collection_name,
        };
        if (updateCollectionDto.active) {
            parseObj.active = JSON.parse(updateCollectionDto.active);
        }
        return this.collectionService.updateCollectionService(id, image_collection, parseObj, res);
    }
    deleteCollection(id, res) {
        return this.collectionService.deleteCollectionService(id, res);
    }
    findOneCollection(id, res) {
        return this.collectionService.findOneCollectionService(id, res);
    }
};
__decorate([
    (0, common_1.Get)(''),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CollectionController.prototype, "findAllCollection", null);
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
    __metadata("design:paramtypes", [CreateCollection_dto_1.CreateCollection, Object, Object]),
    __metadata("design:returntype", void 0)
], CollectionController.prototype, "createCollection", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image_collection', {
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
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, UpdateCollection_dto_1.UpdateCollection, Object]),
    __metadata("design:returntype", void 0)
], CollectionController.prototype, "updateCollection", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], CollectionController.prototype, "deleteCollection", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], CollectionController.prototype, "findOneCollection", null);
CollectionController = __decorate([
    (0, common_1.Controller)('collection'),
    __metadata("design:paramtypes", [collection_service_1.CollectionService])
], CollectionController);
exports.CollectionController = CollectionController;
//# sourceMappingURL=collection.controller.js.map