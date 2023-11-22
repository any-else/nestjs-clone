import { Request, Response } from 'express';
import { CartService } from 'src/cart/service/cart/cart.service';
import { CreateCartDto } from 'src/dtos/CreateCart.dto';
export declare class CartController {
    private cartService;
    constructor(cartService: CartService);
    getCartMe(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    createCart(createCartDto: CreateCartDto, res: Response, req: Request): Promise<Response<any, Record<string, any>>>;
    inCartController(createCartDto: {
        idCartProd: number;
    }, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    decCartController(createCartDto: {
        idCartProd: number;
    }, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteEachItemController(createCartDto: {
        idCartProd: number;
    }, req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
