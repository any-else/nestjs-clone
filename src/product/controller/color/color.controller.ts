import {
  Controller,
  Get,
  Res,
  Body,
  Post,
  Patch,
  Param,
  ParseIntPipe,
  UseInterceptors,
  Req,
  Query,
  Delete,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { memoryStorage } from 'multer';
import { CreateColor } from 'src/dtos/CreateColor.dto';
import { UpdateColor } from 'src/dtos/UpdateColor.dto';
import { OptionalParseIntPipe } from 'src/pipe/int.transform';
import { ColorService } from 'src/product/service/color/color.service';

@Controller('color')
export class ColorController {
  constructor(private colorService: ColorService) {}

  @Get('')
  getAllColor(@Res() res: Response) {
    return this.colorService.getAllColorService(res);
  }

  @Get('color-collection')
  findColorCollection(
    @Query('idCollection', OptionalParseIntPipe) idCollection: number,
    @Res() res: Response,
  ) {
    return this.colorService.findColorCollection(idCollection, res);
  }

  @Post('')
  createColor(
    @Body() createColorDto: CreateColor,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    console.log(createColorDto);
    return this.colorService.createColor(createColorDto, res, req);
  }

  @Patch(':colorId')
  updateColor(
    @Param('colorId', ParseIntPipe) id: number,
    @Body() updateColorDto: UpdateColor,
    @Res() res: Response,
  ) {
    return this.colorService.updateColor(id, updateColorDto, res);
  }

  @Delete(':colorId')
  deleteColor(
    @Param('colorId', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    return this.colorService.deleteColor(id, res);
  }

  @Get(':idColor')
  findOneColor(
    @Param('idColor', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    return this.colorService.findOneColorService(id, res);
  }
}
