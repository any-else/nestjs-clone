/// <reference types="multer" />
import { Request, Response } from 'express';
import { CreateBrand } from 'src/dtos/CreateBrand.dto';
import { BrandService } from 'src/product/service/brand/brand.service';
export declare class BrandController {
    private brandService;
    constructor(brandService: BrandService);
    getBrandCollection(idCollection: number, res: Response): Promise<Response<any, Record<string, any>>>;
    getAllBrands(res: Response): Promise<Response<any, Record<string, any>>>;
    createBrand(createBrandDto: CreateBrand, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    findOneBrand(idBrand: number, res: Response): Promise<Response<any, Record<string, any>>>;
    updateBrand(idBrand: number, updateBrandDto: {
        brand_name: string;
    }, file: Express.Multer.File, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteBrand(idBrand: number, res: Response): Promise<Response<any, Record<string, any>>>;
}
