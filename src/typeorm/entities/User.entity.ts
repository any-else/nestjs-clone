import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  Check,
  OneToMany,
  OneToOne,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Cart } from './Cart.entity';
import { Booking } from './Booking.entity';
import { Blog } from './Blog.entity';
@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  _id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 10, default: 'other' })
  gender: string;

  @Column({ type: 'datetime', nullable: true })
  birthday: Date;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 10, unique: true, nullable: false })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  address: string;

  @Column({
    type: 'varchar',
    length: 50,
    default: 'user',
  })
  role: string;

  @Column({
    type: 'varchar',
    length: 255,
    default:
      'https://res.cloudinary.com/dalz888e7/image/upload/v1684910195/my_image_user/default-user.jpg.jpg',
  })
  photo: string;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column({ type: 'datetime', nullable: true })
  passwordChangeAt: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  passwordResetToken: string;

  @Column({ type: 'datetime', nullable: true })
  passwordResetExpire: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  googleId: string;

  @Column({ type: 'varchar', length: 8, nullable: true })
  otp: string;

  @Column({ type: 'datetime', nullable: true })
  otpExpire: Date;

  @Column({ type: 'datetime', nullable: true })
  otpChangeAt: Date;

  @Column({ type: 'boolean', default: false })
  verified: boolean;

  @Column({ type: 'varchar', length: 8, nullable: true })
  emailToken: string;

  @Column({ type: 'datetime', nullable: true })
  mailTokenExpire: Date;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @OneToOne(() => Cart, (cart) => cart.user, {
    onDelete: 'CASCADE',
  })
  cart: Cart;

  @OneToMany(() => Booking, (cart) => cart.user)
  bookings: Booking[];

  @OneToMany(() => Blog, (blog) => blog.user, {
    onDelete: 'CASCADE',
  })
  blogs: Blog[];

  private isPasswordChanged: boolean = false;

  @BeforeInsert()
  async hashPasswordBeforeSave() {
    this.password = await bcrypt.hash(this.password, 12);
  }

  @BeforeUpdate()
  @BeforeInsert()
  async hashPassword() {
    if (this.isPasswordChanged) {
      this.password = await bcrypt.hash(this.password, 12);
      this.passwordChangeAt = new Date(Date.now() - 1000);
    }
  }

  setPassword(password: string) {
    this.password = password;
    this.isPasswordChanged = true;
  }

  changedPasswordAfter(JWTTimestamp: number) {
    if (this.passwordChangeAt) {
      const changedTimestamp = this.passwordChangeAt.getTime() / 1000;

      return JWTTimestamp < changedTimestamp;
    }

    return false;
  }

  createPasswordResetToken() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    this.passwordResetExpire = new Date(Date.now() + 10 * 60 * 1000);

    return resetToken;
  }
}
