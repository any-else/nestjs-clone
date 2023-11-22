import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User.entity';

@Entity({ name: 'blogs' })
export class Blog {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  _id: number;

  @ManyToOne(() => User, (user) => user.blogs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  blog_image: string;
}
