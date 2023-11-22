import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'token_backlist' })
export class TokenBlackList {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  _id: number;

  @Column({ length: 255, nullable: false })
  token: string;
}
