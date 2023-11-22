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
exports.ColorService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const Color_entity_1 = require("../../../typeorm/entities/Color.entity");
const typeorm_2 = require("typeorm");
let ColorService = class ColorService {
    constructor(colorReporitory) {
        this.colorReporitory = colorReporitory;
    }
    async getAllColorService(res) {
        try {
            const colors = await this.colorReporitory.find();
            res.status(200).json({
                status: 'success',
                colors,
            });
        }
        catch (err) {
            throw new common_1.HttpException({ status: 'success', message: 'Something went wrong in server side !' }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findColorCollection(idCollection, res) {
        try {
            const colors = await this.colorReporitory.find({
                relations: {
                    prod_variant: {
                        product: {
                            category: {
                                collection: true,
                            },
                        },
                    },
                },
                where: {
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
            });
            res.status(200).json({
                status: 'success',
                colors,
            });
        }
        catch (err) {
            return res.status(400).json({
                status: 'error',
                message: err.message,
            });
        }
    }
    async findOneColorService(id, res) {
        try {
            const color = await this.colorReporitory.findOne({
                where: {
                    _id: id,
                },
            });
            if (!color) {
                throw new Error('Color not found');
            }
            res.status(200).json({
                status: 'success',
                color: color,
            });
        }
        catch (err) {
            return res.status(400).json({
                status: 'error',
                message: err.message,
            });
        }
    }
    async createColor(createColorDetail, res, req) {
        try {
            const { color_name, image_color } = createColorDetail;
            const createColorObj = {
                color_name: color_name,
                image_color: image_color,
            };
            const newColor = this.colorReporitory.create(createColorObj);
            await this.colorReporitory.save(newColor);
            res.status(201).json({
                status: 'success',
                color: newColor,
            });
        }
        catch (err) {
            console.log(err);
            throw new common_1.HttpException({ status: 'success', message: 'Something went wrong in server side !' }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateColor(id, updateColorDetail, res) {
        try {
            const color = await this.colorReporitory.update({ _id: id }, updateColorDetail);
            if (!color) {
                throw new Error('Color not found');
            }
            res.status(200).json({
                status: 'success',
                color,
            });
        }
        catch (err) {
            return res.status(400).json({
                status: 'error',
                message: err.message,
            });
        }
    }
    async deleteColor(id, res) {
        try {
            const color = await this.colorReporitory.delete(id);
            if (!color) {
                throw new Error('Color not found');
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
ColorService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Color_entity_1.Color)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ColorService);
exports.ColorService = ColorService;
//# sourceMappingURL=color.service.js.map