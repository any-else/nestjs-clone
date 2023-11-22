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
exports.CategoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const Category_entity_1 = require("../../../typeorm/entities/Category.entity");
const Collection_entity_1 = require("../../../typeorm/entities/Collection.entity");
const typeorm_2 = require("typeorm");
let CategoryService = class CategoryService {
    constructor(categoryRepository, collectionRepository) {
        this.categoryRepository = categoryRepository;
        this.collectionRepository = collectionRepository;
    }
    async createCateBaseCollectionService(collectionId, createCategoryDetail, res) {
        try {
            const collection = await this.collectionRepository.findOne({
                where: { _id: collectionId },
            });
            if (!collection) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Not found this collection',
                });
            }
            const category = await this.categoryRepository.create(createCategoryDetail);
            category.collection = collection;
            await this.categoryRepository.save(category);
            const result = Object.assign(Object.assign({}, category), { length: 0 });
            res.status(200).json({
                status: 'success',
                category: result,
            });
        }
        catch (err) {
            throw new common_1.HttpException({ status: 'success', message: 'Something went wrong in server side !' }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getAllCategoryService(idCollection, res) {
        try {
            const collection = await this.collectionRepository.findOne({
                where: { _id: idCollection },
            });
            if (!collection) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Not found this collection',
                });
            }
            const categories = await this.categoryRepository.find({
                relations: ['products', 'collection'],
                where: {
                    collection: {
                        _id: collection._id,
                    },
                },
            });
            const maps = categories.map((el) => {
                return {
                    _id: el._id,
                    length: el.products.length,
                    category_name: el.category_name,
                    active: el.active,
                    collection: {
                        _id: el.collection._id,
                        collection_name: el.collection.collection_name,
                    },
                };
            });
            return res.status(200).json({
                status: 'success',
                categories: maps,
            });
        }
        catch (err) {
            throw new common_1.HttpException({ status: 'success', message: 'Something went wrong in server side !' }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createCategoryService(createCategoryDetail, res) {
        try {
            const newCategory = await this.categoryRepository.create(createCategoryDetail);
            await this.categoryRepository.save(newCategory);
            return res.status(201).json({
                status: 'success',
                category: newCategory,
            });
        }
        catch (err) {
            throw new common_1.HttpException({ status: 'success', message: 'Something went wrong in server side !' }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async addCollectionToCategory(collectionId, categoryId, res) {
        try {
            const collection = await this.collectionRepository.findOne({
                where: { _id: collectionId },
            });
            const category = await this.categoryRepository.findOne({
                where: { _id: categoryId },
            });
            category.collection = collection;
            await this.categoryRepository.save(category);
            return res.status(200).json({
                status: 'success',
                category,
            });
        }
        catch (err) {
            throw new common_1.HttpException({ status: 'success', message: 'Something went wrong in server side !' }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateCategory(idCategory, updateCategoryDetail, res) {
        try {
            console.log(updateCategoryDetail.collection);
            const collection = await this.collectionRepository.findOne({
                where: { _id: updateCategoryDetail.collection },
            });
            if (!collection) {
                throw new Error('Not found this collection');
            }
            console.log(collection);
            const category = await this.categoryRepository.findOne({
                relations: {
                    collection: true,
                },
                where: { _id: idCategory },
            });
            if (!category) {
                throw new Error('Not found this category');
            }
            category.category_name = updateCategoryDetail.category_name;
            category.active = updateCategoryDetail.active;
            category.collection = collection;
            await this.categoryRepository.save(category);
            return res.status(200).json({
                status: 'success',
                category,
            });
        }
        catch (err) {
            return res.status(400).json({
                status: 'error',
                message: 'Something went wrong in server side !',
            });
        }
    }
    async deleteCategoryService(idCategory, res) {
        try {
            const category = await this.categoryRepository.delete({
                _id: idCategory,
            });
            return res.status(204).json({
                status: 'success',
            });
        }
        catch (err) {
            throw new common_1.HttpException({ status: 'success', message: 'Something went wrong in server side !' }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getAllCats(res) {
        try {
            const categories = await this.categoryRepository.find({
                relations: ['products', 'collection'],
            });
            const maps = categories.map((el) => {
                if (el.collection) {
                    return {
                        _id: el._id,
                        length: el.products.length,
                        category_name: el.category_name,
                        active: el.active,
                        collection: {
                            _id: el.collection._id,
                            collection_name: el.collection.collection_name,
                        },
                    };
                }
                else {
                    return {
                        _id: el._id,
                        length: el.products.length,
                        category_name: el.category_name,
                        active: el.active,
                    };
                }
            });
            return res.status(200).json({
                status: 'success',
                categories: maps,
            });
        }
        catch (err) {
            throw new common_1.HttpException({ status: 'success', message: 'Something went wrong in server side !' }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
CategoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Category_entity_1.Category)),
    __param(1, (0, typeorm_1.InjectRepository)(Collection_entity_1.Collection)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CategoryService);
exports.CategoryService = CategoryService;
//# sourceMappingURL=category.service.js.map