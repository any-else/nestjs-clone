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
exports.CollectionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const Collection_entity_1 = require("../../../typeorm/entities/Collection.entity");
const cloudinary_1 = require("cloudinary");
const typeorm_2 = require("typeorm");
let CollectionService = class CollectionService {
    constructor(collectionRepository) {
        this.collectionRepository = collectionRepository;
    }
    async findAllCollectionService(res) {
        try {
            const collections = await this.collectionRepository.find({
                relations: {
                    categories: true,
                },
            });
            const result = collections.map((el) => {
                return {
                    _id: el._id,
                    collection_name: el.collection_name,
                    active: el.active,
                    category_length: el.categories.length,
                    categories: el.categories,
                    image_collection: el.image_collection,
                };
            });
            res.status(200).json({
                status: 'success',
                collections: result,
            });
        }
        catch (err) {
            console.log(err);
            throw new common_1.HttpException({ status: 'error', message: 'Something went wrong in server side' }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findOneCollectionService(idCollection, res) {
        try {
            const collection = await this.collectionRepository.findOne({
                relations: {
                    categories: true,
                },
                where: { _id: idCollection },
            });
            if (!collection) {
                throw new Error('Not found this collection');
            }
            res.status(200).json({
                status: 'success',
                collection: collection,
            });
        }
        catch (err) {
            return res.status(400).json({
                status: 'error',
                message: err.message,
            });
        }
    }
    async createCollectionService(createCollectionDetail, res, req) {
        try {
            const newCollection = await this.collectionRepository.create({
                collection_name: createCollectionDetail.collection_name,
            });
            if (req.files && Array.isArray(req.files)) {
                const promiseFiles = await Promise.all(req.files.map((file) => {
                    return new Promise(async (resolve, reject) => {
                        const { originalname, buffer, fieldname } = file;
                        if (fieldname === 'image_collection') {
                            cloudinary_1.v2.uploader
                                .upload_stream({
                                folder: 'my_image_product_amazon',
                                public_id: originalname.split('.')[0],
                                resource_type: 'image',
                            }, (error, result) => {
                                if (error) {
                                    console.error(error);
                                    reject(error);
                                }
                                else {
                                    newCollection.image_collection = result.url;
                                    resolve(result);
                                }
                            })
                                .end(buffer);
                        }
                    });
                }));
            }
            await this.collectionRepository.save(newCollection);
            const result = Object.assign(Object.assign({}, newCollection), { category_length: 0 });
            res.status(201).json({
                status: 'success',
                collection: result,
            });
        }
        catch (err) {
            console.log(err);
            throw new common_1.HttpException({ status: 'success', message: 'Something went wrong in server side !' }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateCollectionService(id, file, updateCollectionDetail, res) {
        try {
            const collection = await this.collectionRepository.findOne({
                where: { _id: id },
            });
            if (!collection) {
                return res.status(common_1.HttpStatus.NOT_FOUND).json({
                    status: 'error',
                    message: 'Not found this collection , reload and try again !',
                });
            }
            console.log(collection);
            collection.collection_name = updateCollectionDetail.collection_name;
            collection.active = updateCollectionDetail.active;
            if (file && file.fieldname === 'image_collection') {
                const { originalname, buffer, fieldname } = file;
                const result = await new Promise((resolve, reject) => {
                    cloudinary_1.v2.uploader
                        .upload_stream({
                        folder: 'my_image_user',
                        public_id: originalname.split('.')[0],
                        resource_type: 'image',
                    }, (error, result) => {
                        if (error) {
                            reject(error);
                        }
                        else {
                            resolve(result);
                        }
                    })
                        .end(buffer);
                });
                collection.image_collection = result.url;
            }
            await this.collectionRepository.save(collection);
            return res.status(200).json({
                status: 'success',
            });
        }
        catch (err) {
            console.log(err);
            throw new common_1.HttpException({ status: 'success', message: 'Something went wrong in server side !' }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteCollectionService(id, res) {
        try {
            const collection = await this.collectionRepository.delete(id);
            res.status(200).json({
                status: 'success',
            });
        }
        catch (err) {
            console.log(err);
            throw new common_1.HttpException({ status: 'success', message: 'Something went wrong in server side !' }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
CollectionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Collection_entity_1.Collection)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CollectionService);
exports.CollectionService = CollectionService;
//# sourceMappingURL=collection.service.js.map