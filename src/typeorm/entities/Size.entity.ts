import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ProductVariant } from './ProductVariant.entity';
import { ProductVariantSize } from './ProductVariantSize.entity';

@Entity({ name: 'sizes' })
export class Size {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  _id: number;

  @Column({ length: 255 })
  size_name: string;

  @OneToMany(() => ProductVariantSize, (prod) => prod.size, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_variant_size_id' })
  prod_variant_size: ProductVariantSize[];
}
