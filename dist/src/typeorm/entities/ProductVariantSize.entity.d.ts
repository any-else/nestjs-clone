import { Size } from './Size.entity';
import { ProductVariant } from './ProductVariant.entity';
import { CartProd } from './CartProd.entity';
import { Order } from './Booking.entity';
export declare class ProductVariantSize {
    _id: number;
    size: Size;
    sale: number;
    quantity: number;
    price: number;
    new_price: number;
    prod_variant: ProductVariant;
    cart: CartProd[];
    order: Order[];
    calPrice(): void;
}
