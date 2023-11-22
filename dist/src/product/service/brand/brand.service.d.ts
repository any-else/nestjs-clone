/// <reference types="multer" />
import { Request, Response } from 'express';
import { Brand } from 'src/typeorm/entities/Brand.entity';
import { createBrandService } from 'src/types/types';
import { Repository } from 'typeorm';
import { Product } from 'src/typeorm/entities/Product.entity';
export declare class BrandService {
    private brandRepository;
    private productRepository;
    constructor(brandRepository: Repository<Brand>, productRepository: Repository<Product>);
    findBrands(res: Response): Promise<Response<any, Record<string, any>>>;
    getBrandCollection(idCollection: number, res: Response): Promise<Response<any, Record<string, any>>>;
    createBrand(createBrandDetail: createBrandService, res: Response, req: Request): Promise<Response<any, Record<string, any>>>;
    findOneBrandSerivice(id: number, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteBrand(id: number, res: Response): Promise<Response<any, Record<string, any>>>;
    updateBrand(id: number, updateBrandDetail: {
        brand_name: string;
    }, file: Express.Multer.File, res: Response): Promise<Response<any, Record<string, any>>>;
}
