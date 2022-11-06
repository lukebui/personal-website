import { ParentChildRelationship } from 'src/parent-child-relationships/entities/parent-child-relationship.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class ParentType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @OneToMany(() => ParentChildRelationship, (parent) => parent.type, {
    onDelete: 'RESTRICT',
  })
  parent: ParentChildRelationship[];
}
