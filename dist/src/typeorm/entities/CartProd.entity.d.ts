import { ProductVariantSize } from './ProductVariantSize.entity';
import { Cart } from './Cart.entity';
export declare class CartProd {
    _id: number;
    product: ProductVariantSize;
    quantity: number;
    price: number;
    cart: Cart;
    calPrice(): Promise<void>;
}
