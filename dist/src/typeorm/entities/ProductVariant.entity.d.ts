import { Product } from './Product.entity';
import { Color } from './Color.entity';
import { ImageShow } from './ImageShow.entity';
import { ProductVariantSize } from './ProductVariantSize.entity';
export declare class ProductVariant {
    _id: number;
    product: Product;
    product_variant_size: ProductVariantSize[];
    color: Color;
    image_shows: ImageShow[];
}
