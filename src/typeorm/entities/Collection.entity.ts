import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Category } from './Category.entity';

@Entity({ name: 'collections' })
export class Collection {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  _id: number;

  @Column({ length: 255, unique: true })
  collection_name: string;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @Column({ length: 255, nullable: true })
  image_collection: string;

  @OneToMany(() => Category, (category) => category.collection, {
    onDelete: 'CASCADE',
  })
  categories: Category[];
}
