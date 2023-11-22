import {
  AfterInsert,
  AfterLoad,
  AfterUpdate,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Repository,
} from 'typeorm';
import { ProductVariantSize } from './ProductVariantSize.entity';
import { Cart } from './Cart.entity';
import { InjectRepository } from '@nestjs/typeorm';
import dataSource from 'db/data-source';

@Entity({ name: 'cart_prod' })
export class CartProd {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  _id: number;

  @ManyToOne(() => ProductVariantSize, (prod) => prod.cart, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_variant_id' })
  product: ProductVariantSize;

  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number;

  @ManyToOne(() => Cart, (cart) => cart.cart_prod, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

  @BeforeInsert()
  @BeforeUpdate()
  async calPrice() {
    this.price = this.quantity * this.product.new_price;
  }
}
