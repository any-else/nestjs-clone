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
exports.BlogController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const blog_service_1 = require("../../service/blog/blog.service");
const Blog_dto_1 = require("../../../dtos/Blog.dto");
const auth_guard_1 = require("../../../guard/auth/auth.guard");
let BlogController = class BlogController {
    constructor(blogService) {
        this.blogService = blogService;
    }
    getLimitBlogController(res) {
        return this.blogService.getLimitBlogService(res);
    }
    createBlogController(createBlogDto, file, res, req) {
        return this.blogService.createBlogService(createBlogDto, file, req, res);
    }
    getAllBlogController(res) {
        return this.blogService.getBlogService(res);
    }
    getBlogController(idBlog, res) {
        return this.blogService.getDetailBlogService(idBlog, res);
    }
    updateBlogController(idBlog, updateBlogDto, file, res) {
        return this.blogService.updateBlogService(idBlog, file, updateBlogDto, res);
    }
    deleteBlogController(idBlog, res) {
        return this.blogService.deleteBlogService(idBlog, res);
    }
};
__decorate([
    (0, common_1.Get)('get-limit-blogs'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BlogController.prototype, "getLimitBlogController", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('blog_image', {
        storage: (0, multer_1.memoryStorage)(),
        fileFilter(req, file, callback) {
            if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|avif|AVIF|webp|WEBP)$/)) {
                req.fileValidationError = 'Only image files are allowed!';
                return callback(null, false);
            }
            callback(null, true);
        },
    })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Res)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Blog_dto_1.CreateBlogDto, Object, Object, Object]),
    __metadata("design:returntype", void 0)
], BlogController.prototype, "createBlogController", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BlogController.prototype, "getAllBlogController", null);
__decorate([
    (0, common_1.Get)(':idBlog'),
    __param(0, (0, common_1.Param)('idBlog')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], BlogController.prototype, "getBlogController", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Patch)(':idBlog'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('blog_image', {
        storage: (0, multer_1.memoryStorage)(),
        fileFilter(req, file, callback) {
            if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|avif|AVIF|webp|WEBP)$/)) {
                req.fileValidationError = 'Only image files are allowed!';
                return callback(null, false);
            }
            callback(null, true);
        },
    })),
    __param(0, (0, common_1.Param)('idBlog')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Blog_dto_1.UpdateBlog, Object, Object]),
    __metadata("design:returntype", void 0)
], BlogController.prototype, "updateBlogController", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Delete)(':idBlog'),
    __param(0, (0, common_1.Param)('idBlog')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], BlogController.prototype, "deleteBlogController", null);
BlogController = __decorate([
    (0, common_1.Controller)('blog'),
    __metadata("design:paramtypes", [blog_service_1.BlogService])
], BlogController);
exports.BlogController = BlogController;
//# sourceMappingURL=blog.controller.js.map