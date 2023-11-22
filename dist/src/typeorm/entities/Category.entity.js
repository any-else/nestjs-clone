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
exports.Category = void 0;
const typeorm_1 = require("typeorm");
const Collection_entity_1 = require("./Collection.entity");
const Product_entity_1 = require("./Product.entity");
let Category = class Category {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", Number)
], Category.prototype, "_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: false }),
    __metadata("design:type", String)
], Category.prototype, "category_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Category.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Product_entity_1.Product, (product) => product.category, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", Array)
], Category.prototype, "products", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Collection_entity_1.Collection, (collection) => collection.categories, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'collection_id' }),
    __metadata("design:type", Collection_entity_1.Collection)
], Category.prototype, "collection", void 0);
Category = __decorate([
    (0, typeorm_1.Entity)({ name: 'categories' })
], Category);
exports.Category = Category;
//# sourceMappingURL=Category.entity.js.map