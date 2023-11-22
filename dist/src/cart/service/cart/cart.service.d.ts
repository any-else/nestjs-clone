import { Request, Response } from 'express';
import { Cart } from 'src/typeorm/entities/Cart.entity';
import { CartProd } from 'src/typeorm/entities/CartProd.entity';
import { Product } from 'src/typeorm/entities/Product.entity';
import { ProductVariantSize } from 'src/typeorm/entities/ProductVariantSize.entity';
import { User } from 'src/typeorm/entities/User.entity';
import { createCartService } from 'src/types/types';
import { Repository } from 'typeorm';
export declare class CartService {
    private cartRepository;
    private cartProdRepository;
    private productRepository;
    private productVariantSize;
    private userRepository;
    constructor(cartRepository: Repository<Cart>, cartProdRepository: Repository<CartProd>, productRepository: Repository<Product>, productVariantSize: Repository<ProductVariantSize>, userRepository: Repository<User>);
    createCartService(idProductVariantSize: createCartService, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getCartMe(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    inCartService(idCartProd: number, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    decCartService(idCartProd: number, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteEachItemService(idCartProd: number, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
