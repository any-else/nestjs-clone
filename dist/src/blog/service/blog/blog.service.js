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
exports.BlogService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const Blog_entity_1 = require("../../../typeorm/entities/Blog.entity");
const User_entity_1 = require("../../../typeorm/entities/User.entity");
const typeorm_2 = require("typeorm");
const cloudinary_1 = require("cloudinary");
let BlogService = class BlogService {
    constructor(blogRepository, userRepository) {
        this.blogRepository = blogRepository;
        this.userRepository = userRepository;
    }
    async createBlogService(createBlogDetailL, file, req, res) {
        try {
            console.log('hi');
            const user = await this.userRepository.findOne({
                where: {
                    _id: req['user']._id,
                },
            });
            let imgURl;
            if (file) {
                console.log(file);
                const promise = await new Promise((resolve, reject) => {
                    const { originalname, buffer, fieldname } = file;
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
                            resolve(result);
                        }
                    })
                        .end(buffer);
                });
                imgURl = promise.url;
            }
            const blog = this.blogRepository.create({
                title: createBlogDetailL.title,
                description: createBlogDetailL.description,
                user: user,
                blog_image: imgURl,
            });
            const result = await this.blogRepository.save(blog);
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
    async getBlogService(res) {
        try {
            const blogs = await this.blogRepository.find({
                relations: {
                    user: true,
                },
            });
            return res.status(200).json({
                status: 'success',
                blogs: blogs,
            });
        }
        catch (err) {
            return res.status(400).json({
                status: 'error',
                message: err.message,
            });
        }
    }
    async getDetailBlogService(idBlog, res) {
        try {
            const blog = await this.blogRepository.findOne({
                where: {
                    _id: idBlog,
                },
                relations: {
                    user: true,
                },
            });
            if (!blog) {
                throw new Error('Blog not found');
            }
            return res.status(200).json({
                status: 'success',
                blog: blog,
            });
        }
        catch (err) {
            return res.status(400).json({
                status: 'error',
                message: err.message,
            });
        }
    }
    async updateBlogService(idBlog, file, updateBlogDetail, res) {
        try {
            const blog = await this.blogRepository.findOne({
                where: {
                    _id: idBlog,
                },
                relations: {
                    user: true,
                },
            });
            if (!blog) {
                throw new Error('Blog not found');
            }
            blog.title = updateBlogDetail.title;
            blog.description = updateBlogDetail.description;
            if (file) {
                const promise = await new Promise((resolve, reject) => {
                    const { originalname, buffer, fieldname } = file;
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
                            resolve(result);
                        }
                    })
                        .end(buffer);
                });
                blog.blog_image = promise.url;
            }
            const result = await this.blogRepository.save(blog);
            return res.status(200).json({
                status: 'success',
                blog: result,
            });
        }
        catch (err) {
            return res.status(400).json({
                status: 'error',
                message: err.message,
            });
        }
    }
    async deleteBlogService(idBlog, res) {
        try {
            const blog = await this.blogRepository.findOne({
                where: {
                    _id: idBlog,
                },
                relations: {
                    user: true,
                },
            });
            if (!blog) {
                throw new Error('Blog not found');
            }
            await this.blogRepository.remove(blog);
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
    async getLimitBlogService(res) {
        try {
            const blogs = await this.blogRepository.find({
                relations: {
                    user: true,
                },
                take: 5,
            });
            return res.status(200).json({
                status: 'success',
                blogs: blogs,
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
BlogService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Blog_entity_1.Blog)),
    __param(1, (0, typeorm_1.InjectRepository)(User_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], BlogService);
exports.BlogService = BlogService;
//# sourceMappingURL=blog.service.js.map