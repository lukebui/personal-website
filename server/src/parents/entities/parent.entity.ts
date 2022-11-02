import { Individual } from 'src/individuals/entities/individual.entity';
import { ParentType } from 'src/parent-types/entities/parent-type.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Parent {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ParentType, {
    eager: true,
    nullable: false,
  })
  @JoinColumn()
  type: ParentType;

  @ManyToOne(() => Individual, {
    eager: true,
    onDelete: 'CASCADE',
    nullable: false,
    orphanedRowAction: 'delete',
  })
  @JoinColumn()
  parent: Individual;

  @ManyToOne(() => Individual, {
    eager: true,
    onDelete: 'CASCADE',
    nullable: false,
    orphanedRowAction: 'delete',
  })
  @JoinColumn()
  child: Individual;
}
