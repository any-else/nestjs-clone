import { User } from './User.entity';
import { CartProd } from './CartProd.entity';
export declare class Cart {
    _id: number;
    user: User;
    total: number;
    cart_prod: CartProd[];
}
