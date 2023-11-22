import { Category } from './Category.entity';
import { ProductVariant } from './ProductVariant.entity';
import { Brand } from './Brand.entity';
export declare class Product {
    _id: number;
    name: string;
    description: string;
    product_image: string;
    brand: Brand;
    available: boolean;
    material: string;
    category: Category;
    slug: string;
    prod_variant: ProductVariant[];
    updateSlug(): void;
}
