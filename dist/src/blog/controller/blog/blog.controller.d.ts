/// <reference types="multer" />
import { Request, Response } from 'express';
import { BlogService } from 'src/blog/service/blog/blog.service';
import { CreateBlogDto, UpdateBlog } from 'src/dtos/Blog.dto';
export declare class BlogController {
    private blogService;
    constructor(blogService: BlogService);
    getLimitBlogController(res: Response): Promise<Response<any, Record<string, any>>>;
    createBlogController(createBlogDto: CreateBlogDto, file: Express.Multer.File, res: Response, req: Request): Promise<Response<any, Record<string, any>>>;
    getAllBlogController(res: Response): Promise<Response<any, Record<string, any>>>;
    getBlogController(idBlog: number, res: Response): Promise<Response<any, Record<string, any>>>;
    updateBlogController(idBlog: number, updateBlogDto: UpdateBlog, file: Express.Multer.File, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteBlogController(idBlog: number, res: Response): Promise<Response<any, Record<string, any>>>;
}
