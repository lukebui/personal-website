import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  uid: number;

  @Column()
  displayName: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  @Exclude()
  @ApiHideProperty()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @Column()
  isAdmin: boolean;
}
