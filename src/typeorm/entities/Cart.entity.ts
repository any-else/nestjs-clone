import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User.entity';
import { Product } from './Product.entity';
import { ProductVariantSize } from './ProductVariantSize.entity';
import { CartProd } from './CartProd.entity';

@Entity({ name: 'carts' })
export class Cart {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  _id: number;

  @OneToOne(() => User, (user) => user.cart, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    default: 0,
  })
  total: number;

  @OneToMany(() => CartProd, (cart) => cart.cart, { onDelete: 'CASCADE' })
  cart_prod: CartProd[];
}
