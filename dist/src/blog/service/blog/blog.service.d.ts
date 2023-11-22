/// <reference types="multer" />
import { Request, Response } from 'express';
import { Blog } from 'src/typeorm/entities/Blog.entity';
import { User } from 'src/typeorm/entities/User.entity';
import { Repository } from 'typeorm';
export declare class BlogService {
    private blogRepository;
    private userRepository;
    constructor(blogRepository: Repository<Blog>, userRepository: Repository<User>);
    createBlogService(createBlogDetailL: {
        title: string;
        description: string;
    }, file: Express.Multer.File, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getBlogService(res: Response): Promise<Response<any, Record<string, any>>>;
    getDetailBlogService(idBlog: number, res: Response): Promise<Response<any, Record<string, any>>>;
    updateBlogService(idBlog: number, file: Express.Multer.File, updateBlogDetail: {
        title: string;
        description: string;
    }, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteBlogService(idBlog: number, res: Response): Promise<Response<any, Record<string, any>>>;
    getLimitBlogService(res: Response): Promise<Response<any, Record<string, any>>>;
}
