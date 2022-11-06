import { Couple } from 'src/couples/entities/couple.entity';
import { Individual } from 'src/individuals/entities/individual.entity';
import { ParentType } from 'src/parent-types/entities/parent-type.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class ParentChildRelationship {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ParentType, {
    nullable: false,
  })
  @JoinColumn()
  type: ParentType;

  @ManyToOne(() => Couple, {
    onDelete: 'CASCADE',
    nullable: false,
    orphanedRowAction: 'delete',
  })
  @JoinColumn()
  parentCouple: Couple;

  @ManyToOne(() => Individual, {
    onDelete: 'CASCADE',
    nullable: false,
    orphanedRowAction: 'delete',
  })
  @JoinColumn()
  child: Individual;
}
