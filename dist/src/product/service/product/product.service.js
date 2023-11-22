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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_cloudinary_1 = require("nestjs-cloudinary");
const Category_entity_1 = require("../../../typeorm/entities/Category.entity");
const Collection_entity_1 = require("../../../typeorm/entities/Collection.entity");
const Color_entity_1 = require("../../../typeorm/entities/Color.entity");
const Product_entity_1 = require("../../../typeorm/entities/Product.entity");
const ProductVariant_entity_1 = require("../../../typeorm/entities/ProductVariant.entity");
const Size_entity_1 = require("../../../typeorm/entities/Size.entity");
const typeorm_2 = require("typeorm");
const cloudinary_1 = require("cloudinary");
const ImageShow_entity_1 = require("../../../typeorm/entities/ImageShow.entity");
const ProductVariantSize_entity_1 = require("../../../typeorm/entities/ProductVariantSize.entity");
const Brand_entity_1 = require("../../../typeorm/entities/Brand.entity");
let ProductService = class ProductService {
    constructor(ProductRepository, ProductVariantRepository, ProductVariantSizeRepository, ColorRepository, BrandRepository, SizeRepository, CategoryRepository, CollectionRepository, cloudinaryService, ImageShowRepository) {
        this.ProductRepository = ProductRepository;
        this.ProductVariantRepository = ProductVariantRepository;
        this.ProductVariantSizeRepository = ProductVariantSizeRepository;
        this.ColorRepository = ColorRepository;
        this.BrandRepository = BrandRepository;
        this.SizeRepository = SizeRepository;
        this.CategoryRepository = CategoryRepository;
        this.CollectionRepository = CollectionRepository;
        this.cloudinaryService = cloudinaryService;
        this.ImageShowRepository = ImageShowRepository;
    }
    async findAllProductService(idCategory, res) {
        try {
            const category = await this.CategoryRepository.findOne({
                where: { _id: idCategory },
            });
            if (!category) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Not found this category',
                });
            }
            const productVariants = await this.ProductRepository.find({
                relations: {
                    category: true,
                    prod_variant: {
                        color: true,
                        product_variant_size: {
                            size: true,
                        },
                    },
                    brand: true,
                },
                where: {
                    category: {
                        _id: category._id,
                    },
                },
            });
            res.status(common_1.HttpStatus.OK).json({
                status: 'success',
                length: productVariants.length,
                products: productVariants,
            });
        }
        catch (err) {
            throw new common_1.HttpException({ status: 'error', message: 'Something went wrong in server side' }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findLimitProductService(res) {
        try {
            const products = await this.ProductRepository.find({
                relations: {
                    category: {
                        collection: true,
                    },
                },
                take: 5,
            });
            res.status(common_1.HttpStatus.OK).json({
                status: 'success',
                products,
            });
        }
        catch (err) {
            return res.status(400).json({
                status: 'error',
                message: err.message,
            });
        }
    }
    async findProductCollection(idCollection, idColor, idSize, idBrand, idCategory, available, page, limit, res) {
        try {
            let avai;
            if (available === 'true') {
                avai = true;
            }
            else
                avai = false;
            const options = {
                relations: {
                    category: {
                        collection: true,
                    },
                    prod_variant: {
                        color: true,
                        product_variant_size: {
                            size: true,
                        },
                    },
                },
                where: {
                    category: idCategory
                        ? {
                            _id: (0, typeorm_2.In)([idCategory]),
                            collection: idCollection
                                ? {
                                    _id: idCollection,
                                }
                                : {},
                        }
                        : {
                            collection: idCollection
                                ? {
                                    _id: idCollection,
                                }
                                : {},
                        },
                    available: available ? avai : null,
                    brand: idBrand ? { _id: (0, typeorm_2.In)([idBrand]) } : {},
                    prod_variant: {
                        color: idColor ? { _id: (0, typeorm_2.In)([idColor]) } : {},
                        product_variant_size: {
                            size: idSize ? { _id: (0, typeorm_2.In)([idSize]) } : {},
                        },
                    },
                },
                skip: (page - 1) * limit,
                take: limit,
            };
            const [products, total] = await this.ProductRepository.findAndCount(options);
            const totalPages = Math.ceil(total / limit);
            return res.status(200).json({
                status: 'success',
                products,
                meta: {
                    itemCount: products.length,
                    totalItems: total,
                    itemsPerPage: limit,
                    totalPages,
                    currentPage: page,
                },
            });
        }
        catch (err) {
            return res.status(400).json({
                status: 'error',
                message: err.message,
            });
        }
    }
    async findEachProduct(idProduct, res) {
        try {
            const product = await this.ProductRepository.findOne({
                relations: {
                    category: {
                        collection: true,
                    },
                    prod_variant: {
                        color: true,
                        image_shows: true,
                        product_variant_size: {
                            size: true,
                        },
                    },
                    brand: true,
                },
                where: {
                    _id: idProduct,
                },
            });
            if (!product) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Not found this product',
                });
            }
            res.status(200).json({
                status: 'success',
                product,
            });
        }
        catch (err) {
            throw new common_1.HttpException({ status: 'error', message: 'Something went wrong in server side' }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findEachBySlug(slug, res) {
        try {
            const product = await this.ProductRepository.findOne({
                relations: {
                    category: {
                        collection: true,
                    },
                    prod_variant: {
                        color: true,
                        image_shows: true,
                        product_variant_size: {
                            size: true,
                        },
                    },
                    brand: true,
                },
                where: {
                    slug: slug,
                },
            });
            return res.status(200).json({
                status: 'success',
                product,
            });
        }
        catch (err) {
            return res.status(400).json({
                status: 'error',
                message: err.message,
            });
        }
    }
    async createProduct(createproductDetail, res, req) {
        try {
            const { name, description, brand, material, category, prod_variant } = createproductDetail;
            const cate = await this.CategoryRepository.findOne({
                relations: {
                    collection: true,
                },
                where: {
                    _id: JSON.parse(category)._id,
                    collection: {
                        _id: JSON.parse(category).collection._id,
                    },
                },
            });
            if (!cate) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Not found this category , collection',
                });
            }
            const newProduct = this.ProductRepository.create({
                name: JSON.parse(name),
                description: JSON.parse(description),
                material: JSON.parse(material),
                brand: JSON.parse(brand),
                category: cate,
            });
            let prodImage;
            let imageSlideShows = [];
            const variants = JSON.parse(prod_variant);
            if (req.files && Array.isArray(req.files)) {
                const promiseFiles = await Promise.all(req.files.map((file) => {
                    return new Promise(async (resolve, reject) => {
                        const { originalname, buffer, fieldname } = file;
                        if (fieldname === 'product_image') {
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
                                    prodImage = result.url;
                                    resolve(result);
                                }
                            })
                                .end(buffer);
                        }
                        else {
                            imageSlideShows.push(file);
                            resolve(imageSlideShows);
                        }
                    });
                }));
            }
            newProduct.product_image = prodImage;
            const resultProd = await this.ProductRepository.save(newProduct);
            for (let i = 0; i < variants.length; i++) {
                const _a = variants[i], { _id } = _a, rest = __rest(_a, ["_id"]);
                const createProdVariant = this.ProductVariantRepository.create({
                    color: rest.color,
                    product: resultProd,
                });
                const resultVariant = await this.ProductVariantRepository.save(createProdVariant);
                for (let j = 0; j < rest.product_variant_size.length; j++) {
                    const _b = rest.product_variant_size[j], { _id } = _b, rest2 = __rest(_b, ["_id"]);
                    const createProdVariantSize = this.ProductVariantSizeRepository.create({
                        size: rest2.size,
                        price: rest2.price,
                        quantity: rest2.quantity,
                        sale: rest2.sale,
                        prod_variant: resultVariant,
                    });
                    const resultVariantSize = await this.ProductVariantSizeRepository.save(createProdVariantSize);
                }
                const resultImageShows = Promise.all(imageSlideShows.map((file) => {
                    return new Promise((resolve, reject) => {
                        const { originalname, buffer, fieldname } = file;
                        if (fieldname === `image-slide-show-${i}`) {
                            cloudinary_1.v2.uploader
                                .upload_stream({
                                folder: 'my_image_product_amazon',
                                public_id: originalname.split('.')[0],
                                resource_type: 'image',
                            }, async (error, result) => {
                                if (error) {
                                    console.error(error);
                                    reject(error);
                                }
                                else {
                                    const createImageShow = this.ImageShowRepository.create({
                                        image: result.url,
                                        product_variant: resultVariant,
                                    });
                                    await this.ImageShowRepository.save(createImageShow);
                                    resolve(result);
                                }
                            })
                                .end(buffer);
                        }
                    });
                }));
            }
            res.status(200).json({
                status: 'success',
                product: newProduct,
            });
        }
        catch (err) {
            throw new common_1.HttpException({ status: 'error', message: err.message }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async deleteProduct(idProd, res) {
        try {
            const product = await this.ProductRepository.delete({ _id: idProd });
            res.status(204).json({
                status: 'success',
            });
        }
        catch (err) {
            throw new common_1.HttpException({ status: 'error', message: 'Something went wrong in server side' }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async createProductVariant(createProductVariantDetail, idProd, res) {
        const product = await this.ProductRepository.findOne({
            where: {
                _id: idProd,
            },
        });
        const create = this.ProductVariantRepository.create({
            color: createProductVariantDetail,
            product: product,
        });
        const resultVariant = await this.ProductVariantRepository.save(create);
        return resultVariant;
    }
    async createProductVariantSize(createProductVariantSizeDetail, res) {
        const create = this.ProductVariantSizeRepository.create(Object.assign({}, createProductVariantSizeDetail));
        const result = await this.ProductVariantSizeRepository.save(create);
    }
    async updateProduct(idProduct, updateProductService, res, req) {
        try {
            const prod = JSON.parse(updateProductService.prod);
            let product = await this.ProductRepository.findOne({
                relations: {
                    category: {
                        collection: true,
                    },
                    prod_variant: {
                        color: true,
                        image_shows: true,
                        product_variant_size: {
                            size: true,
                        },
                    },
                    brand: true,
                },
                where: {
                    _id: idProduct,
                },
            });
            const brand = await this.BrandRepository.findOne({
                where: {
                    _id: prod.brand._id,
                },
            });
            const category = await this.CategoryRepository.findOne({
                relations: {
                    collection: true,
                },
                where: {
                    _id: prod.category._id,
                    collection: {
                        _id: prod.category.collection._id,
                    },
                },
            });
            product.name = prod.name;
            product.description = prod.description;
            product.material = prod.material;
            product.brand = brand;
            product.category = category;
            for (let i = 0; i < prod.prod_variant.length; i++) {
                const _a = prod.prod_variant[i], { _id } = _a, rest = __rest(_a, ["_id"]);
                let productvariant = await this.ProductVariantRepository.findOne({
                    relations: {
                        color: true,
                        product_variant_size: {
                            size: true,
                        },
                        image_shows: true,
                    },
                    where: {
                        _id: _id,
                    },
                });
                const color = await this.ColorRepository.findOne({
                    where: {
                        _id: rest.color._id,
                    },
                });
                if (!productvariant) {
                    console.log(product.prod_variant);
                    const createProductVariant = this.ProductVariantRepository.create({
                        color: color,
                        product: product,
                        image_shows: [],
                    });
                    productvariant = await this.ProductVariantRepository.save(createProductVariant);
                    product.prod_variant.push(productvariant);
                }
                else {
                    productvariant.color = color;
                    await this.ProductVariantRepository.save(productvariant);
                }
                for (let j = 0; j < rest.product_variant_size.length; j++) {
                    const _b = rest.product_variant_size[j], { _id } = _b, rest2 = __rest(_b, ["_id"]);
                    let productVariantSize = await this.ProductVariantSizeRepository.findOne({
                        relations: {
                            size: true,
                            prod_variant: {
                                product_variant_size: true,
                            },
                        },
                        where: {
                            _id: _id,
                        },
                    });
                    if (!productVariantSize) {
                        const createProductVariantSize = this.ProductVariantSizeRepository.create({
                            size: rest2.size,
                            price: rest2.price,
                            quantity: rest2.quantity,
                            sale: rest2.sale,
                            prod_variant: productvariant,
                        });
                        productVariantSize = await this.ProductVariantSizeRepository.save(createProductVariantSize);
                    }
                    else {
                        productVariantSize.size = rest2.size;
                        productVariantSize.quantity = rest2.quantity;
                        productVariantSize.price = rest2.price;
                        productVariantSize.sale = rest2.sale;
                        await this.ProductVariantSizeRepository.save(productVariantSize);
                    }
                }
                if (req.files && Array.isArray(req.files)) {
                    req.files.map((file) => {
                        return new Promise((resolve, reject) => {
                            const { originalname, buffer, fieldname } = file;
                            if (fieldname === `image-slide-show-${i}`) {
                                cloudinary_1.v2.uploader
                                    .upload_stream({
                                    folder: 'my_image_product_amazon',
                                    public_id: originalname.split('.')[0],
                                    resource_type: 'image',
                                }, async (error, result) => {
                                    if (error) {
                                        console.error(error);
                                        reject(error);
                                    }
                                    else {
                                        const createImageShow = this.ImageShowRepository.create({
                                            image: result.url,
                                            product_variant: productvariant,
                                        });
                                        await this.ImageShowRepository.save(createImageShow);
                                        resolve(result);
                                    }
                                })
                                    .end(buffer);
                            }
                        });
                    });
                }
            }
            product = await this.ProductRepository.save(product);
            res.status(200).json({
                status: 'success',
                product: product,
            });
        }
        catch (err) {
            console.log(err);
            throw new common_1.HttpException({ status: 'error', message: err.message }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async deleteProductVariant(idVariant, res) {
        try {
            const variant = await this.ProductVariantRepository.findOne({
                where: {
                    _id: idVariant,
                },
            });
            if (!variant)
                return res.status(404).json({
                    status: 'error',
                    message: 'Not found this variant',
                });
            await this.ProductVariantRepository.delete({ _id: idVariant });
            return res.status(200).json({
                status: 'success',
                message: 'Delete successfully',
            });
        }
        catch (err) {
            return res.status(400).json({
                status: 'error',
                message: err.message,
            });
        }
    }
    async deleteProductVariantSize(idVariantSize, res) {
        try {
            const variantSize = await this.ProductVariantSizeRepository.findOne({
                where: {
                    _id: idVariantSize,
                },
            });
            if (!variantSize) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Not found this variant size',
                });
            }
            await this.ProductVariantSizeRepository.delete({ _id: idVariantSize });
            return res.status(200).json({
                status: 'success',
                message: 'Delete successfully',
            });
        }
        catch (err) {
            return res.status(400).json({
                status: 'error',
                message: err.message,
            });
        }
    }
    async deleteImageSlideShow(idImageShow, res) {
        try {
            const imageShow = await this.ImageShowRepository.findOne({
                where: {
                    _id: idImageShow,
                },
            });
            if (!imageShow) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Not found this image show',
                });
            }
            await this.ImageShowRepository.delete({ _id: idImageShow });
            return res.status(200).json({
                status: 'success',
                message: 'Delete successfully',
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
ProductService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Product_entity_1.Product)),
    __param(1, (0, typeorm_1.InjectRepository)(ProductVariant_entity_1.ProductVariant)),
    __param(2, (0, typeorm_1.InjectRepository)(ProductVariantSize_entity_1.ProductVariantSize)),
    __param(3, (0, typeorm_1.InjectRepository)(Color_entity_1.Color)),
    __param(4, (0, typeorm_1.InjectRepository)(Brand_entity_1.Brand)),
    __param(5, (0, typeorm_1.InjectRepository)(Size_entity_1.Size)),
    __param(6, (0, typeorm_1.InjectRepository)(Category_entity_1.Category)),
    __param(7, (0, typeorm_1.InjectRepository)(Collection_entity_1.Collection)),
    __param(9, (0, typeorm_1.InjectRepository)(ImageShow_entity_1.ImageShow)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        nestjs_cloudinary_1.CloudinaryService,
        typeorm_2.Repository])
], ProductService);
exports.ProductService = ProductService;
//# sourceMappingURL=product.service.js.map