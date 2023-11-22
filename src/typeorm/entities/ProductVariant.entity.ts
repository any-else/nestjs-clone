import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
  Unique,
  Index,
} from 'typeorm';
import { Product } from './Product.entity';
import { Color } from './Color.entity';
import { Size } from './Size.entity';
import { ImageShow } from './ImageShow.entity';
import { ProductVariantSize } from './ProductVariantSize.entity';
@Entity({ name: 'products_variant' })
export class ProductVariant {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  _id: number;

  @ManyToOne(() => Product, (prod) => prod.prod_variant, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @OneToMany(() => ProductVariantSize, (prod) => prod.prod_variant, {
    onDelete: 'CASCADE',
  })
  product_variant_size: ProductVariantSize[];

  @ManyToOne(() => Color, (color) => color.prod_variant, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'color_id' })
  color: Color;

  @OneToMany(() => ImageShow, (imageshow) => imageshow.product_variant, {
    onDelete: 'CASCADE',
  })
  image_shows: ImageShow[];
}
