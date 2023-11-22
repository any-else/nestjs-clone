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
exports.Size = void 0;
const typeorm_1 = require("typeorm");
const ProductVariantSize_entity_1 = require("./ProductVariantSize.entity");
let Size = class Size {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", Number)
], Size.prototype, "_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], Size.prototype, "size_name", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ProductVariantSize_entity_1.ProductVariantSize, (prod) => prod.size, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'product_variant_size_id' }),
    __metadata("design:type", Array)
], Size.prototype, "prod_variant_size", void 0);
Size = __decorate([
    (0, typeorm_1.Entity)({ name: 'sizes' })
], Size);
exports.Size = Size;
//# sourceMappingURL=Size.entity.js.map