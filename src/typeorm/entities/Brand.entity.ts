import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './Product.entity';

@Entity({ name: 'brands' })
export class Brand {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  _id: number;

  @Column({ length: 255, nullable: false })
  brand_name: string;

  @Column({ length: 255, nullable: true })
  image_brand: string;

  @OneToMany(() => Product, (prod) => prod.brand, {
    onDelete: 'CASCADE',
  })
  product: Product[];
}
