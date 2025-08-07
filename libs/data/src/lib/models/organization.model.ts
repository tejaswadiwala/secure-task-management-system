import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.model';
import { Task } from './task.model';

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  // Simplified: Optional parent organization (for 2-level hierarchy)
  @Column({ type: 'uuid', nullable: true })
  parentId?: string;

  // Users belonging to this organization
  @OneToMany(() => User, user => user.organization)
  users: User[];

  // Tasks belonging to this organization
  @OneToMany(() => Task, task => task.organization)
  tasks: Task[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
