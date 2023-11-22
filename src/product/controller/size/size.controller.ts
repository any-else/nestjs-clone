import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  Query,
  ParseIntPipe,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateSize } from 'src/dtos/CreateSize.dto';
import { UpdateSizeDto } from 'src/dtos/UpdateSize.dto';
import { OptionalParseIntPipe } from 'src/pipe/int.transform';
import { SizeService } from 'src/product/service/size/size.service';

@Controller('size')
export class SizeController {
  constructor(private sizeService: SizeService) {}

  @Get('size-collection')
  getSizeCollection(
    @Query('idCollection', OptionalParseIntPipe) idCollection: number,
    @Res() res: Response,
  ) {
    return this.sizeService.getSizeCollection(idCollection, res);
  }

  @Get('')
  getAllSize(@Res() res: Response) {
    return this.sizeService.findAllSizeService(res);
  }

  @Post('')
  createSize(@Body() createSizeDto: CreateSize, @Res() res: Response) {
    return this.sizeService.createSizeService(createSizeDto, res);
  }

  @Get(':idSize')
  findSize(@Param('idSize', ParseIntPipe) id: number, @Res() res: Response) {
    return this.sizeService.findEachSize(id, res);
  }

  @Patch(':idSize')
  updateSize(
    @Param('idSize', ParseIntPipe) id: number,
    @Body() updateSizeDto: UpdateSizeDto,
    @Res() res: Response,
  ) {
    return this.sizeService.updateSizeService(id, updateSizeDto, res);
  }

  @Delete(':idSize')
  deleteSize(@Param('idSize', ParseIntPipe) id: number, @Res() res: Response) {
    return this.sizeService.deleteSizeService(id, res);
  }
}
