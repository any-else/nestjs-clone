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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageShow = void 0;
const typeorm_1 = require("typeorm");
const ProductVariant_entity_1 = require("./ProductVariant.entity");
let ImageShow = class ImageShow {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", Number)
], ImageShow.prototype, "_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], ImageShow.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ProductVariant_entity_1.ProductVariant, (variant) => variant.image_shows, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'product_variant_id' }),
    __metadata("design:type", ProductVariant_entity_1.ProductVariant)
], ImageShow.prototype, "product_variant", void 0);
ImageShow = __decorate([
    (0, typeorm_1.Entity)({ name: 'imageshows' })
], ImageShow);
exports.ImageShow = ImageShow;
//# sourceMappingURL=ImageShow.entity.js.map