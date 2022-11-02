import { Parent } from 'src/parents/entities/parent.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class ParentType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @OneToMany(() => Parent, (parent) => parent.type, { onDelete: 'RESTRICT' })
  parent: Parent[];
}
