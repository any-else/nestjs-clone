import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import { Color } from 'src/typeorm/entities/Color.entity';
import { CreateColorService, UpdateColorService } from 'src/types/types';
import { Repository } from 'typeorm';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';

@Injectable()
export class ColorService {
  constructor(
    @InjectRepository(Color) private colorReporitory: Repository<Color>,
  ) {}

  async getAllColorService(res: Response) {
    try {
      const colors = await this.colorReporitory.find();
      res.status(200).json({
        status: 'success',
        colors,
      });
    } catch (err) {
      throw new HttpException(
        { status: 'success', message: 'Something went wrong in server side !' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findColorCollection(idCollection: number, res: Response) {
    try {
      const colors = await this.colorReporitory.find({
        relations: {
          prod_variant: {
            product: {
              category: {
                collection: true,
              },
            },
          },
        },
        where: {
          prod_variant: {
            product: {
              category: {
                collection: {
                  _id: idCollection,
                },
              },
            },
          },
        },
      });

      res.status(200).json({
        status: 'success',
        colors,
      });
    } catch (err) {
      return res.status(400).json({
        status: 'error',
        message: err.message,
      });
    }
  }

  async findOneColorService(id: number, res: Response) {
    try {
      const color = await this.colorReporitory.findOne({
        where: {
          _id: id,
        },
      });
      if (!color) {
        throw new Error('Color not found');
      }
      res.status(200).json({
        status: 'success',
        color: color,
      });
    } catch (err) {
      return res.status(400).json({
        status: 'error',
        message: err.message,
      });
    }
  }
  async createColor(
    createColorDetail: CreateColorService,
    res: Response,
    req: Request,
  ) {
    try {
      const { color_name, image_color } = createColorDetail;
      const createColorObj = {
        color_name: color_name,
        image_color: image_color,
      };
      const newColor = this.colorReporitory.create(createColorObj);
      await this.colorReporitory.save(newColor);
      res.status(201).json({
        status: 'success',
        color: newColor,
      });
    } catch (err) {
      console.log(err);
      throw new HttpException(
        { status: 'success', message: 'Something went wrong in server side !' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateColor(
    id: number,
    updateColorDetail: UpdateColorService,
    res: Response,
  ) {
    try {
      const color = await this.colorReporitory.update(
        { _id: id },
        updateColorDetail,
      );
      if (!color) {
        throw new Error('Color not found');
      }
      res.status(200).json({
        status: 'success',
        color,
      });
    } catch (err) {
      return res.status(400).json({
        status: 'error',
        message: err.message,
      });
    }
  }

  async deleteColor(id: number, res: Response) {
    try {
      const color = await this.colorReporitory.delete(id);
      if (!color) {
        throw new Error('Color not found');
      }
      res.status(200).json({
        status: 'success',
      });
    } catch (err) {
      return res.status(400).json({
        status: 'error',
        message: err.message,
      });
    }
  }
}
