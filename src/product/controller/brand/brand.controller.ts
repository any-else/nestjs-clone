import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { memoryStorage } from 'multer';
import { CreateBrand } from 'src/dtos/CreateBrand.dto';
import { OptionalParseIntPipe } from 'src/pipe/int.transform';
import { BrandService } from 'src/product/service/brand/brand.service';

@Controller('brand')
export class BrandController {
  constructor(private brandService: BrandService) {}

  @Get('brand-collection')
  getBrandCollection(
    @Query('idCollection', OptionalParseIntPipe) idCollection: number,
    @Res() res: Response,
  ) {
    return this.brandService.getBrandCollection(idCollection, res);
  }

  @Get('')
  getAllBrands(@Res() res: Response) {
    return this.brandService.findBrands(res);
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
  createBrand(
    @Body() createBrandDto: CreateBrand,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.brandService.createBrand(createBrandDto, res, req);
  }

  @Get(':idBrand')
  findOneBrand(
    @Param('idBrand', ParseIntPipe) idBrand: number,
    @Res() res: Response,
  ) {
    return this.brandService.findOneBrandSerivice(idBrand, res);
  }

  @Patch(':idBrand')
  @UseInterceptors(
    FileInterceptor('image_brand', {
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
  updateBrand(
    @Param('idBrand', ParseIntPipe) idBrand: number,
    @Body() updateBrandDto: { brand_name: string },
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    return this.brandService.updateBrand(idBrand, updateBrandDto, file, res);
  }

  @Delete(':idBrand')
  deleteBrand(
    @Param('idBrand', ParseIntPipe) idBrand: number,
    @Res() res: Response,
  ) {
    return this.brandService.deleteBrand(idBrand, res);
  }
}
