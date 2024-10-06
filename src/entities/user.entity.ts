import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 50 })
  username!: string;

  @Column({ length: 100, nullable: true })
  displayName?: string;

  @Column({ length: 200, nullable: true })
  bio?: string;

  @Column({ nullable: true })
  profilePictureUrl?: string;

  @Column({ type: 'jsonb', nullable: true })
  preferences?: Record<string, any>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
