import {
  Controller,
  Get,
  Res,
  Post,
  Body,
  Patch,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Delete,
  UseInterceptors,
  Req,
  UploadedFile,
} from '@nestjs/common';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { memoryStorage } from 'multer';
import { CreateCollection } from 'src/dtos/CreateCollection.dto';
import { UpdateCollection } from 'src/dtos/UpdateCollection.dto';
import { CollectionService } from 'src/product/service/collection/collection.service';

@Controller('collection')
export class CollectionController {
  constructor(private collectionService: CollectionService) {}

  @Get('')
  findAllCollection(@Res() res: Response) {
    return this.collectionService.findAllCollectionService(res);
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
  createCollection(
    @Body() createCollectionDto: CreateCollection,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    return this.collectionService.createCollectionService(
      createCollectionDto,
      res,
      req,
    );
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('image_collection', {
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
  updateCollection(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() image_collection: Express.Multer.File,
    @Body() updateCollectionDto: UpdateCollection,
    @Res() res: Response,
  ) {
    // const { image_collection } = updateCollectionDto;
    console.log(updateCollectionDto);
    let parseObj: {
      collection_name?: string;
      active?: boolean;
    } = {
      collection_name: updateCollectionDto.collection_name,
    };
    if (updateCollectionDto.active) {
      parseObj.active = JSON.parse(updateCollectionDto.active);
    }
    return this.collectionService.updateCollectionService(
      id,
      image_collection,
      parseObj,
      res,
    );
  }

  @Delete(':id')
  deleteCollection(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    return this.collectionService.deleteCollectionService(id, res);
  }
  @Get(':id')
  findOneCollection(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    return this.collectionService.findOneCollectionService(id, res);
  }
}
