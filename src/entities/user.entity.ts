import { IsEmail } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity()
@Unique(['user_id', 'username', 'email', 'phone_number'])
@Index('IDX_USER_USERNAME', ['username'], { unique: true })
@Index('IDX_USER_EMAIL', ['email'], { unique: true })
@Index('IDX_USER_MOBILE', ['phone_number'], { unique: true })
export class Users {
  @PrimaryGeneratedColumn('uuid')
  user_id!: string;

  @Column({ length: 50, nullable: false })
  username!: string;

  @Column({ length: 50, nullable: false })
  display_name!: string;

  @Column({ unique: true, length: 255 })
  cognito_sub!: string;

  @Column({ length: 255, nullable: true })
  @IsEmail()
  email?: string;

  @Column({ length: 20, nullable: true })
  phone_number?: string;

  @CreateDateColumn()
  last_login!: Date;

  @CreateDateColumn()
  account_created_at!: Date;

  @UpdateDateColumn()
  account_updated_at!: Date;
}
