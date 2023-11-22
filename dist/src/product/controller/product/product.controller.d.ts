import { Request, Response } from 'express';
import { CreateProduct } from 'src/dtos/CreateProduct.dto';
import { UpdateProduct } from 'src/dtos/UpdateProduct.dto';
import { ProductService } from 'src/product/service/product/product.service';
export declare class ProductController {
    private productService;
    constructor(productService: ProductService);
    findAllController(idCategory: number, res: Response): Promise<Response<any, Record<string, any>>>;
    findLimitProduct(res: Response): Promise<Response<any, Record<string, any>>>;
    findBySlug(slug: string, res: Response): Promise<Response<any, Record<string, any>>>;
    getProductCollection(idCollection: number, idColor: number[], idSize: number[], idBrand: number[], idCategory: number[], available: string, page: number, limit: number, res: Response): Promise<Response<any, Record<string, any>>>;
    getEachProduct(idProduct: number, res: Response): Promise<Response<any, Record<string, any>>>;
    createProduct(createProductDto: CreateProduct, res: Response, req: Request): Response<any, Record<string, any>> | Promise<Response<any, Record<string, any>>>;
    updateProduct(idProduct: number, updateProductDto: UpdateProduct, res: Response, req: Request): Promise<void>;
    deleteProduct(idProduct: number, res: Response): Promise<void>;
    deleteProductVariant(idProduct: number, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteProductVariantSize(idProduct: number, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteImageSlideShow(idImageShow: number, res: Response): Promise<Response<any, Record<string, any>>>;
}
