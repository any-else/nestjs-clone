import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { ImageShow } from './ImageShow.entity';
import { ProductVariant } from './ProductVariant.entity';

@Entity({ name: 'colors' })
export class Color {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  _id: number;

  @Column({ length: 255, nullable: false })
  color_name: string;

  @Column({ length: 255, nullable: true })
  image_color: string;

  @OneToMany(() => ProductVariant, (prod) => prod.color, {
    onDelete: 'CASCADE',
  })
  prod_variant: ProductVariant[];
}
