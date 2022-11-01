import { Individual } from 'src/individuals/entities/individual.entity';
import { ParentType } from 'src/parent-types/entities/parent-type.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Parent {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ParentType, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn()
  type: ParentType;

  @ManyToOne(() => Individual, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn()
  parent: Individual;

  @ManyToOne(() => Individual, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn()
  child: Individual;
}
