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
exports.CategoryController = void 0;
const common_1 = require("@nestjs/common");
const CreateCategory_dto_1 = require("../../../dtos/CreateCategory.dto");
const UpdateCategory_dto_1 = require("../../../dtos/UpdateCategory.dto");
const category_service_1 = require("../../service/category/category.service");
let CategoryController = class CategoryController {
    constructor(categoryService) {
        this.categoryService = categoryService;
    }
    getAllCates(res) {
        return this.categoryService.getAllCats(res);
    }
    createCategoryBaseCollection(collection, createCatgoryDto, res) {
        return this.categoryService.createCateBaseCollectionService(collection, createCatgoryDto, res);
    }
    getAllCategory(res, idCollection) {
        return this.categoryService.getAllCategoryService(idCollection, res);
    }
    createCategory(createCategoryDto, res) {
        return this.categoryService.createCategoryService(createCategoryDto, res);
    }
    addCollection(collectionId, categoryId, res) {
        return this.categoryService.addCollectionToCategory(collectionId, categoryId, res);
    }
    updateCategory(idCategory, updateCategoryDto, res) {
        return this.categoryService.updateCategory(idCategory, updateCategoryDto, res);
    }
    deleteCategory(idCategory, res) {
        return this.categoryService.deleteCategoryService(idCategory, res);
    }
};
__decorate([
    (0, common_1.Get)(''),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "getAllCates", null);
__decorate([
    (0, common_1.Post)('create-category/:collection'),
    __param(0, (0, common_1.Param)('collection', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, CreateCategory_dto_1.CreateCategory, Object]),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "createCategoryBaseCollection", null);
__decorate([
    (0, common_1.Get)(':idCollection/categories'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Param)('idCollection', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "getAllCategory", null);
__decorate([
    (0, common_1.Post)(''),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateCategory_dto_1.CreateCategory, Object]),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Patch)('add-collection/:collectionId/:categoryId'),
    __param(0, (0, common_1.Param)('collectionId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('categoryId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "addCollection", null);
__decorate([
    (0, common_1.Patch)('update/:idCategory'),
    __param(0, (0, common_1.Param)('idCategory', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, UpdateCategory_dto_1.UpdateCategory, Object]),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "updateCategory", null);
__decorate([
    (0, common_1.Delete)('delete/:idCategory'),
    __param(0, (0, common_1.Param)('idCategory', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "deleteCategory", null);
CategoryController = __decorate([
    (0, common_1.Controller)('category'),
    __metadata("design:paramtypes", [category_service_1.CategoryService])
], CategoryController);
exports.CategoryController = CategoryController;
//# sourceMappingURL=category.controller.js.map