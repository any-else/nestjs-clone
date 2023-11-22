import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import { CloudinaryService } from 'nestjs-cloudinary';
import { Category } from 'src/typeorm/entities/Category.entity';
import { Collection } from 'src/typeorm/entities/Collection.entity';
import { Color } from 'src/typeorm/entities/Color.entity';
import { Product } from 'src/typeorm/entities/Product.entity';
import { ProductVariant } from 'src/typeorm/entities/ProductVariant.entity';
import { Size } from 'src/typeorm/entities/Size.entity';
import {
  ColorServiceType,
  CreateProductService,
  UpdateProductService,
} from 'src/types/types';
import { FindManyOptions, In, Repository } from 'typeorm';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import { ImageShow } from 'src/typeorm/entities/ImageShow.entity';
import { ProductVariantSize } from 'src/typeorm/entities/ProductVariantSize.entity';
import { uploadImageCloudinary } from 'src/utils/cloudinary';
import { paginate } from 'nestjs-typeorm-paginate';
import { Brand } from 'src/typeorm/entities/Brand.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private ProductRepository: Repository<Product>,
    @InjectRepository(ProductVariant)
    private ProductVariantRepository: Repository<ProductVariant>,
    @InjectRepository(ProductVariantSize)
    private ProductVariantSizeRepository: Repository<ProductVariantSize>,
    @InjectRepository(Color)
    private ColorRepository: Repository<Color>,
    @InjectRepository(Brand)
    private BrandRepository: Repository<Brand>,
    @InjectRepository(Size)
    private SizeRepository: Repository<Size>,
    @InjectRepository(Category)
    private CategoryRepository: Repository<Category>,
    @InjectRepository(Collection)
    private CollectionRepository: Repository<Collection>,
    private cloudinaryService: CloudinaryService,
    @InjectRepository(ImageShow)
    private ImageShowRepository: Repository<ImageShow>,
  ) {}

  async findAllProductService(idCategory: number, res: Response) {
    try {
      const category = await this.CategoryRepository.findOne({
        where: { _id: idCategory },
      });
      if (!category) {
        return res.status(404).json({
          status: 'error',
          message: 'Not found this category',
        });
      }
      const productVariants = await this.ProductRepository.find({
        relations: {
          category: true,
          prod_variant: {
            color: true,
            product_variant_size: {
              size: true,
            },
          },
          brand: true,
        },
        where: {
          category: {
            _id: category._id,
          },
        },
      });
      res.status(HttpStatus.OK).json({
        status: 'success',
        length: productVariants.length,
        products: productVariants,
      });
    } catch (err) {
      throw new HttpException(
        { status: 'error', message: 'Something went wrong in server side' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findLimitProductService(res: Response) {
    try {
      const products = await this.ProductRepository.find({
        relations: {
          category: {
            collection: true,
          },
        },
        take: 5,
      });
      res.status(HttpStatus.OK).json({
        status: 'success',
        products,
      });
    } catch (err) {
      return res.status(400).json({
        status: 'error',
        message: err.message,
      });
    }
  }

  async findProductCollection(
    idCollection: number,
    idColor: number[],
    idSize: number[],
    idBrand: number[],
    idCategory: number[],
    available: string,
    page: number,
    limit: number,
    res: Response,
  ) {
    try {
      let avai: boolean;
      if (available === 'true') {
        avai = true;
      } else avai = false;
      const options: FindManyOptions<Product> = {
        relations: {
          category: {
            collection: true,
          },
          prod_variant: {
            color: true,
            product_variant_size: {
              size: true,
            },
          },
        },
        where: {
          category: idCategory
            ? {
                _id: In([idCategory]),
                collection: idCollection
                  ? {
                      _id: idCollection,
                    }
                  : {},
              }
            : {
                collection: idCollection
                  ? {
                      _id: idCollection,
                    }
                  : {},
              },
          available: available ? avai : null,
          brand: idBrand ? { _id: In([idBrand]) } : {},
          prod_variant: {
            color: idColor ? { _id: In([idColor]) } : {},
            product_variant_size: {
              size: idSize ? { _id: In([idSize]) } : {},
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
      };

      const [products, total] = await this.ProductRepository.findAndCount(
        options,
      );
      const totalPages = Math.ceil(total / limit);

      return res.status(200).json({
        status: 'success',
        products,
        meta: {
          itemCount: products.length,
          totalItems: total,
          itemsPerPage: limit,
          totalPages,
          currentPage: page,
        },
      });
    } catch (err) {
      return res.status(400).json({
        status: 'error',
        message: err.message,
      });
    }
  }

  async findEachProduct(idProduct: number, res: Response) {
    try {
      const product = await this.ProductRepository.findOne({
        relations: {
          category: {
            collection: true,
          },
          prod_variant: {
            color: true,
            image_shows: true,
            product_variant_size: {
              size: true,
            },
          },
          brand: true,
        },
        where: {
          _id: idProduct,
        },
      });

      if (!product) {
        return res.status(404).json({
          status: 'error',
          message: 'Not found this product',
        });
      }
      res.status(200).json({
        status: 'success',
        product,
      });
    } catch (err) {
      throw new HttpException(
        { status: 'error', message: 'Something went wrong in server side' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findEachBySlug(slug: string, res: Response) {
    try {
      const product = await this.ProductRepository.findOne({
        relations: {
          category: {
            collection: true,
          },
          prod_variant: {
            color: true,
            image_shows: true,
            product_variant_size: {
              size: true,
            },
          },
          brand: true,
        },
        where: {
          slug: slug,
        },
      });

      return res.status(200).json({
        status: 'success',
        product,
      });
    } catch (err) {
      return res.status(400).json({
        status: 'error',
        message: err.message,
      });
    }
  }

  async createProduct(createproductDetail: any, res: Response, req: Request) {
    try {
      const { name, description, brand, material, category, prod_variant } =
        createproductDetail;
      const cate = await this.CategoryRepository.findOne({
        relations: {
          collection: true,
        },
        where: {
          _id: JSON.parse(category)._id,
          collection: {
            _id: JSON.parse(category).collection._id,
          },
        },
      });
      if (!cate) {
        return res.status(400).json({
          status: 'error',
          message: 'Not found this category , collection',
        });
      }
      const newProduct = this.ProductRepository.create({
        name: JSON.parse(name),
        description: JSON.parse(description),
        material: JSON.parse(material),
        brand: JSON.parse(brand),
        category: cate,
      });
      let prodImage;
      let imageSlideShows: any[] = [];
      const variants = JSON.parse(prod_variant);
      if (req.files && Array.isArray(req.files)) {
        const promiseFiles = await Promise.all(
          req.files.map((file) => {
            return new Promise(async (resolve, reject) => {
              const { originalname, buffer, fieldname } = file;
              if (fieldname === 'product_image') {
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
                        prodImage = result.url;
                        resolve(result);
                      }
                    },
                  )
                  .end(buffer);
              } else {
                imageSlideShows.push(file);
                resolve(imageSlideShows);
              }
            });
          }),
        );
      }
      newProduct.product_image = prodImage;
      const resultProd = await this.ProductRepository.save(newProduct);
      for (let i = 0; i < variants.length; i++) {
        const { _id, ...rest } = variants[i];
        const createProdVariant = this.ProductVariantRepository.create({
          color: rest.color,
          product: resultProd,
        });
        const resultVariant = await this.ProductVariantRepository.save(
          createProdVariant,
        );
        for (let j = 0; j < rest.product_variant_size.length; j++) {
          const { _id, ...rest2 } = rest.product_variant_size[j];
          const createProdVariantSize =
            this.ProductVariantSizeRepository.create({
              size: rest2.size,
              price: rest2.price,
              quantity: rest2.quantity,
              sale: rest2.sale,
              prod_variant: resultVariant,
            });
          const resultVariantSize =
            await this.ProductVariantSizeRepository.save(createProdVariantSize);
        }
        const resultImageShows = Promise.all(
          imageSlideShows.map((file) => {
            return new Promise((resolve, reject) => {
              const { originalname, buffer, fieldname } = file;
              if (fieldname === `image-slide-show-${i}`) {
                v2.uploader
                  .upload_stream(
                    {
                      folder: 'my_image_product_amazon',
                      public_id: originalname.split('.')[0],
                      resource_type: 'image',
                    },
                    async (error, result) => {
                      if (error) {
                        console.error(error);
                        reject(error);
                      } else {
                        const createImageShow = this.ImageShowRepository.create(
                          {
                            image: result.url,
                            product_variant: resultVariant,
                          },
                        );
                        await this.ImageShowRepository.save(createImageShow);
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

      res.status(200).json({
        status: 'success',
        product: newProduct,
      });
    } catch (err) {
      throw new HttpException(
        { status: 'error', message: err.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteProduct(idProd: number, res: Response) {
    try {
      const product = await this.ProductRepository.delete({ _id: idProd });
      res.status(204).json({
        status: 'success',
      });
    } catch (err) {
      throw new HttpException(
        { status: 'error', message: 'Something went wrong in server side' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async createProductVariant(
    createProductVariantDetail: ColorServiceType,
    idProd: number,
    res: Response,
  ) {
    const product = await this.ProductRepository.findOne({
      where: {
        _id: idProd,
      },
    });
    const create = this.ProductVariantRepository.create({
      color: createProductVariantDetail,
      product: product,
    });
    const resultVariant = await this.ProductVariantRepository.save(create);

    return resultVariant;
  }

  async createProductVariantSize(
    createProductVariantSizeDetail: any,
    res: Response,
  ) {
    const create = this.ProductVariantSizeRepository.create({
      ...createProductVariantSizeDetail,
    });

    const result = await this.ProductVariantSizeRepository.save(create);
  }

  async updateProduct(
    idProduct: number,
    updateProductService: any,
    res: Response,
    req: Request,
  ) {
    try {
      const prod = JSON.parse(updateProductService.prod);

      let product = await this.ProductRepository.findOne({
        relations: {
          category: {
            collection: true,
          },
          prod_variant: {
            color: true,
            image_shows: true,
            product_variant_size: {
              size: true,
            },
          },
          brand: true,
        },
        where: {
          _id: idProduct,
        },
      });
      const brand = await this.BrandRepository.findOne({
        where: {
          _id: prod.brand._id,
        },
      });
      const category = await this.CategoryRepository.findOne({
        relations: {
          collection: true,
        },
        where: {
          _id: prod.category._id,
          collection: {
            _id: prod.category.collection._id,
          },
        },
      });
      product.name = prod.name;
      product.description = prod.description;
      product.material = prod.material;
      product.brand = brand;
      product.category = category;
      // product.prod_variant = prod.prod_variant;
      for (let i = 0; i < prod.prod_variant.length; i++) {
        // console.log(prod.prod_variant[i].image_shows);
        // console.log(product.prod_variant[i].image_shows);
        const { _id, ...rest } = prod.prod_variant[i];
        let productvariant = await this.ProductVariantRepository.findOne({
          relations: {
            color: true,
            product_variant_size: {
              size: true,
            },
            image_shows: true,
          },
          where: {
            _id: _id,
          },
        });
        const color = await this.ColorRepository.findOne({
          where: {
            _id: rest.color._id,
          },
        });
        if (!productvariant) {
          console.log(product.prod_variant);
          const createProductVariant = this.ProductVariantRepository.create({
            color: color,
            product: product,
            image_shows: [],
          });
          productvariant = await this.ProductVariantRepository.save(
            createProductVariant,
          );
          product.prod_variant.push(productvariant);
        } else {
          productvariant.color = color;
          await this.ProductVariantRepository.save(productvariant);
        }
        for (let j = 0; j < rest.product_variant_size.length; j++) {
          const { _id, ...rest2 } = rest.product_variant_size[j];
          let productVariantSize =
            await this.ProductVariantSizeRepository.findOne({
              relations: {
                size: true,
                prod_variant: {
                  product_variant_size: true,
                },
              },
              where: {
                _id: _id,
              },
            });
          if (!productVariantSize) {
            const createProductVariantSize =
              this.ProductVariantSizeRepository.create({
                size: rest2.size,
                price: rest2.price,
                quantity: rest2.quantity,
                sale: rest2.sale,
                prod_variant: productvariant,
              });
            productVariantSize = await this.ProductVariantSizeRepository.save(
              createProductVariantSize,
            );
          } else {
            productVariantSize.size = rest2.size;
            productVariantSize.quantity = rest2.quantity;
            productVariantSize.price = rest2.price;
            productVariantSize.sale = rest2.sale;
            await this.ProductVariantSizeRepository.save(productVariantSize);
          }
        }
        if (req.files && Array.isArray(req.files)) {
          req.files.map((file) => {
            return new Promise((resolve, reject) => {
              const { originalname, buffer, fieldname } = file;
              if (fieldname === `image-slide-show-${i}`) {
                v2.uploader
                  .upload_stream(
                    {
                      folder: 'my_image_product_amazon',
                      public_id: originalname.split('.')[0],
                      resource_type: 'image',
                    },
                    async (error, result) => {
                      if (error) {
                        console.error(error);
                        reject(error);
                      } else {
                        const createImageShow = this.ImageShowRepository.create(
                          {
                            image: result.url,
                            product_variant: productvariant,
                          },
                        );
                        await this.ImageShowRepository.save(createImageShow);
                        resolve(result);
                      }
                    },
                  )
                  .end(buffer);
              }
            });
          });
        }
      }

      product = await this.ProductRepository.save(product);
      res.status(200).json({
        status: 'success',
        product: product,
      });
    } catch (err) {
      console.log(err);
      throw new HttpException(
        { status: 'error', message: err.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteProductVariant(idVariant: number, res: Response) {
    try {
      const variant = await this.ProductVariantRepository.findOne({
        where: {
          _id: idVariant,
        },
      });

      if (!variant)
        return res.status(404).json({
          status: 'error',
          message: 'Not found this variant',
        });

      await this.ProductVariantRepository.delete({ _id: idVariant });
      return res.status(200).json({
        status: 'success',
        message: 'Delete successfully',
      });
    } catch (err) {
      return res.status(400).json({
        status: 'error',
        message: err.message,
      });
    }
  }

  async deleteProductVariantSize(idVariantSize: number, res: Response) {
    try {
      const variantSize = await this.ProductVariantSizeRepository.findOne({
        where: {
          _id: idVariantSize,
        },
      });
      if (!variantSize) {
        return res.status(404).json({
          status: 'error',
          message: 'Not found this variant size',
        });
      }
      await this.ProductVariantSizeRepository.delete({ _id: idVariantSize });
      return res.status(200).json({
        status: 'success',
        message: 'Delete successfully',
      });
    } catch (err) {
      return res.status(400).json({
        status: 'error',
        message: err.message,
      });
    }
  }

  async deleteImageSlideShow(idImageShow: number, res: Response) {
    try {
      const imageShow = await this.ImageShowRepository.findOne({
        where: {
          _id: idImageShow,
        },
      });
      if (!imageShow) {
        return res.status(404).json({
          status: 'error',
          message: 'Not found this image show',
        });
      }
      await this.ImageShowRepository.delete({ _id: idImageShow });
      return res.status(200).json({
        status: 'success',
        message: 'Delete successfully',
      });
    } catch (err) {
      return res.status(400).json({
        status: 'error',
        message: err.message,
      });
    }
  }
}
