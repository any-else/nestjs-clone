import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { Size } from 'src/typeorm/entities/Size.entity';
import { CreateSizeService } from 'src/types/types';
import { Repository } from 'typeorm';

@Injectable()
export class SizeService {
  constructor(
    @InjectRepository(Size) private sizeRepository: Repository<Size>,
  ) {}

  async findAllSizeService(res: Response) {
    try {
      const sizes = await this.sizeRepository.find();
      res.status(200).json({
        status: 'success',
        sizes,
      });
    } catch (err) {
      console.log(err);
      throw new HttpException(
        { status: 'success', message: 'Something went wrong in server side !' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getSizeCollection(idCollection: number, res: Response) {
    try {
      console.log(idCollection);
      const sizes = await this.sizeRepository.find({
        relations: {
          prod_variant_size: {
            prod_variant: {
              product: {
                category: {
                  collection: true,
                },
              },
            },
          },
        },
        where: {
          prod_variant_size: {
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
        },
      });
      return res.status(200).json({
        status: 'success',
        sizes,
      });
    } catch (err) {
      return res.status(400).json({
        status: 'success',
        message: err.message,
      });
    }
  }

  async createSizeService(createSizeDetail: CreateSizeService, res: Response) {
    try {
      const size = await this.sizeRepository.create(createSizeDetail);
      await this.sizeRepository.save(size);

      res.status(201).json({
        status: 'success',
        size,
      });
    } catch (err) {
      console.log(err);
      throw new HttpException(
        { status: 'success', message: 'Something went wrong in server side !' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findEachSize(idSize: number, res: Response) {
    try {
      const size = await this.sizeRepository.findOne({
        where: {
          _id: idSize,
        },
      });
      if (!size) {
        throw new Error('Size not found');
      }
      res.status(200).json({
        status: 'success',
        size,
      });
    } catch (err) {
      return res.status(400).json({
        status: 'error',
        message: err.message,
      });
    }
  }

  async updateSizeService(
    id: number,
    updateSizeDetail: { size_name: string },
    res: Response,
  ) {
    try {
      const size = await this.sizeRepository.update(id, updateSizeDetail);
      if (!size) {
        throw new Error('Size not found');
      }
      res.status(200).json({
        status: 'success',
        size,
      });
    } catch (err) {
      return res.status(400).json({
        status: 'error',
        message: err.message,
      });
    }
  }

  async deleteSizeService(id: number, res: Response) {
    try {
      const size = await this.sizeRepository.delete(id);
      if (!size) {
        throw new Error('Size not found');
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
