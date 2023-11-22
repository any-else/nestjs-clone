import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User.entity';
import { ProductVariantSize } from './ProductVariantSize.entity';

@Entity({ name: 'booking_status' })
export class BookingStatus {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column()
  name: string;

  @OneToMany(() => Booking, (booking) => booking.status, {
    onDelete: 'CASCADE',
  })
  bookings: Booking[];
}

@Entity({ name: 'bookings' })
export class Booking {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column()
  country: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  apartment: string;

  @Column()
  city: string;

  @Column()
  postal_code: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  email: string;

  @ManyToOne(() => BookingStatus, (status) => status.bookings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'status_id' })
  status: BookingStatus;

  @ManyToOne(() => User, (user) => user.bookings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Order, (order) => order.bookings, {
    onDelete: 'CASCADE',
  })
  order: Order[];

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  total: number;

  @Column({ nullable: true })
  payment_method: string;

  @Column({ nullable: true })
  brand: string;

  @Column({ nullable: true })
  transaction_id: string;
}

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column()
  quantity: number;

  @ManyToOne(() => ProductVariantSize, (product) => product.order, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_variant_id' })
  product: ProductVariantSize;

  @ManyToOne(() => Booking, (booking) => booking.order, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'booking_id' })
  bookings: Booking;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  new_price: number;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  calPrice() {
    this.new_price = this.product.new_price * this.quantity;
  }
}
