import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { memoryStorage } from 'multer';
import { BlogService } from 'src/blog/service/blog/blog.service';
import { CreateBlogDto, UpdateBlog } from 'src/dtos/Blog.dto';
import { AuthGuard } from 'src/guard/auth/auth.guard';

@Controller('blog')
export class BlogController {
  constructor(private blogService: BlogService) {}

  @Get('get-limit-blogs')
  getLimitBlogController(@Res() res: Response) {
    return this.blogService.getLimitBlogService(res);
  }

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('blog_image', {
      storage: memoryStorage(),
      fileFilter(req, file, callback) {
        if (
          !file.originalname.match(
            /\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|avif|AVIF|webp|WEBP)$/,
          )
        ) {
          req.fileValidationError = 'Only image files are allowed!';
          return callback(null, false);
        }
        callback(null, true);
      },
    }),
  )
  createBlogController(
    @Body() createBlogDto: CreateBlogDto,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    return this.blogService.createBlogService(createBlogDto, file, req, res);
  }

  @Get()
  getAllBlogController(@Res() res: Response) {
    return this.blogService.getBlogService(res);
  }

  @Get(':idBlog')
  getBlogController(@Param('idBlog') idBlog: number, @Res() res: Response) {
    return this.blogService.getDetailBlogService(idBlog, res);
  }

  @UseGuards(AuthGuard)
  @Patch(':idBlog')
  @UseInterceptors(
    FileInterceptor('blog_image', {
      storage: memoryStorage(),
      fileFilter(req, file, callback) {
        if (
          !file.originalname.match(
            /\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|avif|AVIF|webp|WEBP)$/,
          )
        ) {
          req.fileValidationError = 'Only image files are allowed!';
          return callback(null, false);
        }
        callback(null, true);
      },
    }),
  )
  updateBlogController(
    @Param('idBlog') idBlog: number,
    @Body() updateBlogDto: UpdateBlog,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    return this.blogService.updateBlogService(idBlog, file, updateBlogDto, res);
  }

  @UseGuards(AuthGuard)
  @Delete(':idBlog')
  deleteBlogController(@Param('idBlog') idBlog: number, @Res() res: Response) {
    return this.blogService.deleteBlogService(idBlog, res);
  }
}
