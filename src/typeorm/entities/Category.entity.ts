import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Collection } from './Collection.entity';
import { Product } from './Product.entity';
@Entity({ name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  _id: number;

  @Column({ length: 255, nullable: false })
  category_name: string;

  @Column({ default: true })
  active: boolean;

  @OneToMany(() => Product, (product) => product.category, {
    onDelete: 'CASCADE',
  })
  products: Product[];

  @ManyToOne(() => Collection, (collection) => collection.categories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'collection_id' })
  collection: Collection;
}
