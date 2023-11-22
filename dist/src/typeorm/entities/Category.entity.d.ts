import { Collection } from './Collection.entity';
import { Product } from './Product.entity';
export declare class Category {
    _id: number;
    category_name: string;
    active: boolean;
    products: Product[];
    collection: Collection;
}
