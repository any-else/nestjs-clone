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
exports.BrandService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const Brand_entity_1 = require("../../../typeorm/entities/Brand.entity");
const typeorm_2 = require("typeorm");
const cloudinary_1 = require("cloudinary");
const Product_entity_1 = require("../../../typeorm/entities/Product.entity");
let BrandService = class BrandService {
    constructor(brandRepository, productRepository) {
        this.brandRepository = brandRepository;
        this.productRepository = productRepository;
    }
    async findBrands(res) {
        try {
            const brands = await this.brandRepository.find();
            return res.status(200).json({
                status: 'success',
                brands: brands,
            });
        }
        catch (err) {
            console.log(err);
            return res.status(400).json({
                status: 'error',
                message: err.message,
            });
        }
    }
    async getBrandCollection(idCollection, res) {
        try {
            const query = {
                relations: {
                    product: {
                        category: {
                            collection: true,
                        },
                    },
                },
                where: {
                    product: {
                        category: {
                            collection: {
                                _id: idCollection,
                            },
                        },
                    },
                },
            };
            const brands = await this.brandRepository.find(query);
            return res.status(200).json({
                status: 'success',
                brands,
            });
        }
        catch (err) {
            return res.status(400).json({
                status: 'error',
                message: err.message,
            });
        }
    }
    async createBrand(createBrandDetail, res, req) {
        try {
            const newBrand = await this.brandRepository.create({
                brand_name: createBrandDetail.brand_name,
            });
            if (req.files && Array.isArray(req.files)) {
                const promiseFiles = await Promise.all(req.files.map((file) => {
                    return new Promise(async (resolve, reject) => {
                        const { originalname, buffer, fieldname } = file;
                        if (fieldname === 'image_brand') {
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
                                    newBrand.image_brand = result.url;
                                    resolve(result);
                                }
                            })
                                .end(buffer);
                        }
                    });
                }));
            }
            const saveBrand = await this.brandRepository.save(newBrand);
            return res.status(201).json({
                status: 'success',
                brand: Object.assign(Object.assign({}, saveBrand), { product_length: 0 }),
            });
        }
        catch (err) {
            return res.status(400).json({
                status: 'error',
                message: err.message,
            });
        }
    }
    async findOneBrandSerivice(id, res) {
        try {
            const brand = await this.brandRepository.findOne({
                where: {
                    _id: id,
                },
            });
            if (!brand) {
                throw new Error('Brand not found');
            }
            return res.status(200).json({
                status: 'success',
                brand,
            });
        }
        catch (err) {
            return res.status(400).json({
                status: 'error',
                message: err.message,
            });
        }
    }
    async deleteBrand(id, res) {
        try {
            const brand = await this.brandRepository.delete(id);
            if (!brand) {
                throw new Error('Brand not found');
            }
            return res.status(200).json({
                status: 'success',
            });
        }
        catch (err) {
            return res.status(400).json({
                status: 'error',
                message: err.message,
            });
        }
    }
    async updateBrand(id, updateBrandDetail, file, res) {
        try {
            const brand = await this.brandRepository.findOne({
                where: {
                    _id: id,
                },
            });
            if (!brand) {
                throw new Error('Brand not found');
            }
            brand.brand_name = updateBrandDetail.brand_name;
            if (file && file.fieldname === 'image_brand') {
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
                brand.image_brand = result.url;
            }
            await this.brandRepository.save(brand);
            return res.status(200).json({
                status: 'success',
            });
        }
        catch (err) {
            return res.status(400).json({
                status: 'error',
                message: err.message,
            });
        }
    }
};
BrandService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Brand_entity_1.Brand)),
    __param(1, (0, typeorm_1.InjectRepository)(Product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], BrandService);
exports.BrandService = BrandService;
//# sourceMappingURL=brand.service.js.map