import { Profile } from '../profile/profile.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  OneToOne,
} from 'typeorm';

@Entity('users')
@Unique(['cognitoId'])
@Unique(['username'])
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  cognitoId!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  username!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  displayName?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  mobile?: string;

  @Column({ type: 'date', nullable: false })
  dateOfBirth!: Date;

  @OneToOne(() => Profile, profile => profile.user, { cascade: true })
  profile!: Profile;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
