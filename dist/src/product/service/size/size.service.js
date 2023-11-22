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
exports.SizeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const Size_entity_1 = require("../../../typeorm/entities/Size.entity");
const typeorm_2 = require("typeorm");
let SizeService = class SizeService {
    constructor(sizeRepository) {
        this.sizeRepository = sizeRepository;
    }
    async findAllSizeService(res) {
        try {
            const sizes = await this.sizeRepository.find();
            res.status(200).json({
                status: 'success',
                sizes,
            });
        }
        catch (err) {
            console.log(err);
            throw new common_1.HttpException({ status: 'success', message: 'Something went wrong in server side !' }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getSizeCollection(idCollection, res) {
        try {
            console.log(idCollection);
            const sizes = await this.sizeRepository.find({
                relations: {
                    prod_variant_size: {
                        prod_variant: {
                            product: {
                                category: {
                                    collection: true,
                                },
                            },
                        },
                    },
                },
                where: {
                    prod_variant_size: {
                        prod_variant: {
                            product: {
                                category: {
                                    collection: {
                                        _id: idCollection,
                                    },
                                },
                            },
                        },
                    },
                },
            });
            return res.status(200).json({
                status: 'success',
                sizes,
            });
        }
        catch (err) {
            return res.status(400).json({
                status: 'success',
                message: err.message,
            });
        }
    }
    async createSizeService(createSizeDetail, res) {
        try {
            const size = await this.sizeRepository.create(createSizeDetail);
            await this.sizeRepository.save(size);
            res.status(201).json({
                status: 'success',
                size,
            });
        }
        catch (err) {
            console.log(err);
            throw new common_1.HttpException({ status: 'success', message: 'Something went wrong in server side !' }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findEachSize(idSize, res) {
        try {
            const size = await this.sizeRepository.findOne({
                where: {
                    _id: idSize,
                },
            });
            if (!size) {
                throw new Error('Size not found');
            }
            res.status(200).json({
                status: 'success',
                size,
            });
        }
        catch (err) {
            return res.status(400).json({
                status: 'error',
                message: err.message,
            });
        }
    }
    async updateSizeService(id, updateSizeDetail, res) {
        try {
            const size = await this.sizeRepository.update(id, updateSizeDetail);
            if (!size) {
                throw new Error('Size not found');
            }
            res.status(200).json({
                status: 'success',
                size,
            });
        }
        catch (err) {
            return res.status(400).json({
                status: 'error',
                message: err.message,
            });
        }
    }
    async deleteSizeService(id, res) {
        try {
            const size = await this.sizeRepository.delete(id);
            if (!size) {
                throw new Error('Size not found');
            }
            res.status(200).json({
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
SizeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Size_entity_1.Size)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SizeService);
exports.SizeService = SizeService;
//# sourceMappingURL=size.service.js.map