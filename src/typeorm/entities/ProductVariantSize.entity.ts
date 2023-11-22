import {
  AfterInsert,
  AfterLoad,
  AfterRemove,
  AfterUpdate,
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
import { Size } from './Size.entity';
import { ProductVariant } from './ProductVariant.entity';
import dataSource from 'db/data-source';
import { Product } from './Product.entity';
import { Cart } from './Cart.entity';
import { CartProd } from './CartProd.entity';
import { Order } from './Booking.entity';

@Entity({ name: 'products_variant_size' })
export class ProductVariantSize {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  _id: number;

  @ManyToOne(() => Size, (size) => size.prod_variant_size, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'size_id' })
  size: Size;

  @Column({ type: 'int', default: 0 })
  sale: number;

  @Column({ type: 'bigint' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  new_price: number;

  @ManyToOne(() => ProductVariant, (prod) => prod.product_variant_size, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_variant_id' })
  prod_variant: ProductVariant;

  @OneToMany(() => CartProd, (cart) => cart.product, { onDelete: 'CASCADE' })
  cart: CartProd[];

  @OneToMany(() => Order, (order) => order.product, { onDelete: 'CASCADE' })
  order: Order[];

  @BeforeInsert()
  @BeforeUpdate()
  calPrice() {
    const discount = this.price * (this.sale / 100);
    this.new_price = this.price - discount;
  }
}
