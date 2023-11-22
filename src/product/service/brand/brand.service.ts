import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import { Brand } from 'src/typeorm/entities/Brand.entity';
import { createBrandService } from 'src/types/types';
import { Repository } from 'typeorm';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import { Product } from 'src/typeorm/entities/Product.entity';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async findBrands(res: Response) {
    try {
      const brands = await this.brandRepository.find();
      // const results = await Promise.all(
      //   brands.map(async (el) => {
      //     const productLength = await this.productRepository.find({
      //       relations: {
      //         brand: true,
      //       },
      //       where: {
      //         brand: {
      //           _id: el._id,
      //         },
      //       },
      //     });
      //     return {
      //       _id: el._id,
      //       brand_name: el.brand_name,
      //       image_brand: el.image_brand,
      //       product_length: productLength.length,
      //     };
      //   }),
      // );
      return res.status(200).json({
        status: 'success',
        brands: brands,
      });
    } catch (err) {
      console.log(err);

      return res.status(400).json({
        status: 'error',
        message: err.message,
      });
    }
  }

  async getBrandCollection(idCollection: number, res: Response) {
    try {
      const query = {
        relations: {
          product: {
            category: {
              collection: true,
            },
          },
        },
        where: {
          product: {
            category: {
              collection: {
                _id: idCollection,
              },
            },
          },
        },
      };
      const brands = await this.brandRepository.find(query);
      return res.status(200).json({
        status: 'success',
        brands,
      });
    } catch (err) {
      return res.status(400).json({
        status: 'error',
        message: err.message,
      });
    }
  }

  async createBrand(
    createBrandDetail: createBrandService,
    res: Response,
    req: Request,
  ) {
    try {
      const newBrand = await this.brandRepository.create({
        brand_name: createBrandDetail.brand_name,
      });
      if (req.files && Array.isArray(req.files)) {
        const promiseFiles = await Promise.all(
          req.files.map((file) => {
            return new Promise(async (resolve, reject) => {
              const { originalname, buffer, fieldname } = file;
              if (fieldname === 'image_brand') {
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
                        newBrand.image_brand = result.url;
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
      const saveBrand = await this.brandRepository.save(newBrand);
      return res.status(201).json({
        status: 'success',
        brand: {
          ...saveBrand,
          product_length: 0,
        },
      });
    } catch (err) {
      return res.status(400).json({
        status: 'error',
        message: err.message,
      });
    }
  }

  async findOneBrandSerivice(id: number, res: Response) {
    try {
      const brand = await this.brandRepository.findOne({
        where: {
          _id: id,
        },
      });
      if (!brand) {
        throw new Error('Brand not found');
      }
      return res.status(200).json({
        status: 'success',
        brand,
      });
    } catch (err) {
      return res.status(400).json({
        status: 'error',
        message: err.message,
      });
    }
  }

  async deleteBrand(id: number, res: Response) {
    try {
      const brand = await this.brandRepository.delete(id);
      if (!brand) {
        throw new Error('Brand not found');
      }
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

  async updateBrand(
    id: number,
    updateBrandDetail: { brand_name: string },
    file: Express.Multer.File,
    res: Response,
  ) {
    try {
      const brand = await this.brandRepository.findOne({
        where: {
          _id: id,
        },
      });
      if (!brand) {
        throw new Error('Brand not found');
      }
      brand.brand_name = updateBrandDetail.brand_name;
      if (file && file.fieldname === 'image_brand') {
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
        brand.image_brand = result.url;
      }
      await this.brandRepository.save(brand);
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
}
