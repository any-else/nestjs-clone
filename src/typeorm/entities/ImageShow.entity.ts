import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Color } from './Color.entity';
import { ProductVariant } from './ProductVariant.entity';

@Entity({ name: 'imageshows' })
export class ImageShow {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  _id: number;

  @Column({ length: 255 })
  image: string;

  @ManyToOne(() => ProductVariant, (variant) => variant.image_shows, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_variant_id' })
  product_variant: ProductVariant;
}
