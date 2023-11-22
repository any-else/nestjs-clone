import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
  AfterLoad,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
} from 'typeorm';
import { Category } from './Category.entity';
import { ProductVariant } from './ProductVariant.entity';
import slugify from 'slugify';
import { Brand } from './Brand.entity';
// import * as slugify from 'slugify'
@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  _id: number;

  @Column({ length: 255, nullable: false, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 255, nullable: false })
  product_image: string;

  @ManyToOne(() => Brand, (brand) => brand.product, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @Column({ default: false })
  available: boolean;

  @Column({ length: 255, nullable: true })
  material: string;

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ nullable: true })
  slug: string;

  @OneToMany(() => ProductVariant, (prodVariant) => prodVariant.product, {
    onDelete: 'CASCADE',
  })
  prod_variant: ProductVariant[];

  @BeforeInsert()
  @BeforeUpdate()
  @AfterInsert()
  @AfterUpdate()
  updateSlug() {
    this.slug = slugify(this.name, { locale: 'vi', lower: true });
  }
}
