import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import { Collection } from 'src/typeorm/entities/Collection.entity';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';

import {
  CreateCollectionService,
  UpdateCollectionService,
} from 'src/types/types';
import { Repository } from 'typeorm';
import { Multer } from 'multer';

@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(Collection)
    private collectionRepository: Repository<Collection>,
  ) {}

  async findAllCollectionService(res: Response) {
    try {
      const collections = await this.collectionRepository.find({
        relations: {
          categories: true,
        },
      });
      const result = collections.map((el) => {
        return {
          _id: el._id,
          collection_name: el.collection_name,
          active: el.active,
          category_length: el.categories.length,
          categories: el.categories,
          image_collection: el.image_collection,
        };
      });
      res.status(200).json({
        status: 'success',
        collections: result,
      });
    } catch (err) {
      console.log(err);
      throw new HttpException(
        { status: 'error', message: 'Something went wrong in server side' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOneCollectionService(idCollection: number, res: Response) {
    try {
      const collection = await this.collectionRepository.findOne({
        relations: {
          categories: true,
        },
        where: { _id: idCollection },
      });
      if (!collection) {
        throw new Error('Not found this collection');
      }
      res.status(200).json({
        status: 'success',
        collection: collection,
      });
    } catch (err) {
      return res.status(400).json({
        status: 'error',
        message: err.message,
      });
    }
  }

  async createCollectionService(
    createCollectionDetail: CreateCollectionService,
    res: Response,
    req: Request,
  ) {
    try {
      const newCollection = await this.collectionRepository.create({
        collection_name: createCollectionDetail.collection_name,
      });
      if (req.files && Array.isArray(req.files)) {
        const promiseFiles = await Promise.all(
          req.files.map((file) => {
            return new Promise(async (resolve, reject) => {
              const { originalname, buffer, fieldname } = file;
              if (fieldname === 'image_collection') {
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
                        newCollection.image_collection = result.url;
                        resolve(result);
                      }
                    },
                  )
                  .end(buffer);
              }
            });
          }),
        );
      }
      await this.collectionRepository.save(newCollection);
      const result = {
        ...newCollection,
        category_length: 0,
      };
      res.status(201).json({
        status: 'success',
        collection: result,
      });
    } catch (err) {
      console.log(err);
      throw new HttpException(
        { status: 'success', message: 'Something went wrong in server side !' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateCollectionService(
    id: number,
    file: Express.Multer.File,
    updateCollectionDetail: UpdateCollectionService,
    res: Response,
  ) {
    try {
      const collection = await this.collectionRepository.findOne({
        where: { _id: id },
      });
      if (!collection) {
        return res.status(HttpStatus.NOT_FOUND).json({
          status: 'error',
          message: 'Not found this collection , reload and try again !',
        });
      }
      console.log(collection);
      collection.collection_name = updateCollectionDetail.collection_name;
      collection.active = updateCollectionDetail.active;
      if (file && file.fieldname === 'image_collection') {
        const { originalname, buffer, fieldname } = file;
        const result: any = await new Promise((resolve, reject) => {
          v2.uploader
            .upload_stream(
              {
                folder: 'my_image_user',
                public_id: originalname.split('.')[0],
                resource_type: 'image',
              },
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(result);
                }
              },
            )
            .end(buffer);
        });
        collection.image_collection = result.url;
      }
      await this.collectionRepository.save(collection);

      return res.status(200).json({
        status: 'success',
      });
    } catch (err) {
      console.log(err);
      throw new HttpException(
        { status: 'success', message: 'Something went wrong in server side !' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteCollectionService(id: number, res: Response) {
    try {
      const collection = await this.collectionRepository.delete(id);
      res.status(200).json({
        status: 'success',
      });
    } catch (err) {
      console.log(err);
      throw new HttpException(
        { status: 'success', message: 'Something went wrong in server side !' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
