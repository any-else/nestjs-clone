import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import { Blog } from 'src/typeorm/entities/Blog.entity';
import { User } from 'src/typeorm/entities/User.entity';
import { Repository } from 'typeorm';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog) private blogRepository: Repository<Blog>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async createBlogService(
    createBlogDetailL: { title: string; description: string },
    file: Express.Multer.File,
    req: Request,
    res: Response,
  ) {
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
        const promise: any = await new Promise((resolve, reject) => {
          const { originalname, buffer, fieldname } = file;
          v2.uploader
            .upload_stream(
              {
                folder: 'my_image_product_amazon',
                public_id: originalname.split('.')[0],
                resource_type: 'image',
              },
              (error, result) => {
                if (error) {
                  console.error(error);
                  reject(error);
                } else {
                  resolve(result);
                }
              },
            )
            .end(buffer);
        });
        // console.log(promise);
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
    } catch (err) {
      return res.status(400).json({
        status: 'error',
        message: err.message,
      });
    }
  }

  async getBlogService(res: Response) {
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
    } catch (err) {
      return res.status(400).json({
        status: 'error',
        message: err.message,
      });
    }
  }

  async getDetailBlogService(idBlog: number, res: Response) {
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
    } catch (err) {
      return res.status(400).json({
        status: 'error',
        message: err.message,
      });
    }
  }

  async updateBlogService(
    idBlog: number,
    file: Express.Multer.File,
    updateBlogDetail: {
      title: string;
      description: string;
    },
    res: Response,
  ) {
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
        const promise: any = await new Promise((resolve, reject) => {
          const { originalname, buffer, fieldname } = file;
          v2.uploader
            .upload_stream(
              {
                folder: 'my_image_product_amazon',
                public_id: originalname.split('.')[0],
                resource_type: 'image',
              },
              (error, result) => {
                if (error) {
                  console.error(error);
                  reject(error);
                } else {
                  resolve(result);
                }
              },
            )
            .end(buffer);
        });

        blog.blog_image = promise.url;
      }
      const result = await this.blogRepository.save(blog);

      return res.status(200).json({
        status: 'success',
        blog: result,
      });
    } catch (err) {
      return res.status(400).json({
        status: 'error',
        message: err.message,
      });
    }
  }

  async deleteBlogService(idBlog: number, res: Response) {
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
    } catch (err) {
      return res.status(400).json({
        status: 'error',
        message: err.message,
      });
    }
  }

  async getLimitBlogService(res: Response) {
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
    } catch (err) {
      return res.status(400).json({
        status: 'error',
        message: err.message,
      });
    }
  }
}
