// user.entity.ts

import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Leave } from 'src/leave/entities/leave.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ default: 'USER' })
  role: string;

  @Column({ default: 0 })
  reliquatConge: number;

  @Column({ default: 0 })
  congeConsomme: number;

  @Column({ default: 0 })
  reliquatN_1: number;

  @OneToMany(() => Leave, leave => leave.user)
  leaves: Leave[];
}
