import {
  Controller,
  Get,
  Res,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Delete,
  Req,
  UseInterceptors,
  UploadedFiles,
  Patch,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import {
  AnyFilesInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { Request, Response, response } from 'express';
import { memoryStorage } from 'multer';
import { FormDataRequest, MemoryStoredFile } from 'nestjs-form-data';
import { CreateProduct } from 'src/dtos/CreateProduct.dto';
import { UpdateProduct } from 'src/dtos/UpdateProduct.dto';
import { OptionalParseBooleanPipe } from 'src/pipe/boolean.transform';
import { OptionalParseIntPipe } from 'src/pipe/int.transform';
import { OptionalParseIntArrayPipe } from 'src/pipe/parse.transform';
import { ProductService } from 'src/product/service/product/product.service';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get(':idCategory')
  findAllController(
    @Param('idCategory', ParseIntPipe) idCategory: number,
    @Res() res: Response,
  ) {
    return this.productService.findAllProductService(idCategory, res);
  }

  @Get('limit-product/limit')
  findLimitProduct(@Res() res: Response) {
    return this.productService.findLimitProductService(res);
  }

  @Get('prod/:slug')
  findBySlug(@Param('slug') slug: string, @Res() res: Response) {
    return this.productService.findEachBySlug(slug, res);
  }

  @Get('product-collection/get')
  getProductCollection(
    @Query('idCollection', OptionalParseIntPipe) idCollection: number,
    @Query('color', OptionalParseIntArrayPipe) idColor: number[],
    @Query('size', OptionalParseIntArrayPipe) idSize: number[],
    @Query('brand', OptionalParseIntArrayPipe) idBrand: number[],
    @Query('category', OptionalParseIntArrayPipe) idCategory: number[],
    @Query('available', OptionalParseBooleanPipe) available: string,
    @Query('page', OptionalParseIntPipe) page: number,
    @Query('limit', OptionalParseIntPipe) limit: number,

    @Res() res: Response,
  ) {
    return this.productService.findProductCollection(
      idCollection,
      idColor,
      idSize,
      idBrand,
      idCategory,
      available,
      page,
      limit,
      res,
    );
  }

  @Get('get-each-product/:idProduct')
  getEachProduct(
    @Param('idProduct', ParseIntPipe) idProduct: number,
    @Res() res: Response,
  ) {
    return this.productService.findEachProduct(idProduct, res);
  }

  @Post('')
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: memoryStorage(),
      fileFilter: (req, file, cb) => {
        if (
          !file.originalname.match(
            /\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|avif|AVIF|webp|WEBP)$/,
          )
        ) {
          req.fileValidationError = 'Only image files are allowed!';
          return cb(null, false);
        } else {
          cb(null, true);
        }
      },
    }),
  )
  createProduct(
    @Body() createProductDto: CreateProduct,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    try {
      return this.productService.createProduct(createProductDto, res, req);
    } catch (err) {
      return res.status(400).json({
        status: 'error',
        message: err.message,
      });
    }
  }

  @Patch('update/:idProduct')
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: memoryStorage(),
      fileFilter(req, file, cb) {
        if (
          !file.originalname.match(
            /\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|avif|AVIF|webp|WEBP)$/,
          )
        ) {
          req.fileValidationError = 'Only image files are allowed!';
          return cb(null, false);
        }
        cb(null, true);
      },
    }),
  )
  updateProduct(
    @Param('idProduct', ParseIntPipe) idProduct: number,
    @Body() updateProductDto: UpdateProduct,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    return this.productService.updateProduct(
      idProduct,
      updateProductDto,
      res,
      req,
    );
  }

  @Delete('delete/:idProduct')
  deleteProduct(
    @Param('idProduct', ParseIntPipe) idProduct: number,
    @Res() res: Response,
  ) {
    return this.productService.deleteProduct(idProduct, res);
  }

  @Delete('delete-product-variant/:idProduct')
  deleteProductVariant(
    @Param('idProduct', ParseIntPipe) idProduct: number,
    @Res() res: Response,
  ) {
    return this.productService.deleteProductVariant(idProduct, res);
  }

  @Delete('delete-product-variant-size/:idProduct')
  deleteProductVariantSize(
    @Param('idProduct', ParseIntPipe) idProduct: number,
    @Res() res: Response,
  ) {
    return this.productService.deleteProductVariantSize(idProduct, res);
  }

  @Delete('delete-image-slide-show/:idImageShow')
  deleteImageSlideShow(
    @Param('idImageShow', ParseIntPipe) idImageShow: number,
    @Res() res: Response,
  ) {
    return this.productService.deleteImageSlideShow(idImageShow, res);
  }
}
