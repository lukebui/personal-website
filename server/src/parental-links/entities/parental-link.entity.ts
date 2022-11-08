import { Couple } from 'src/couples/entities/couple.entity';
import { Individual } from 'src/individuals/entities/individual.entity';
import { ParentalType } from 'src/parental-types/entities/parental-type.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['parentCouple', 'child'])
export class ParentalLink {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ParentalType, {
    nullable: false,
  })
  @JoinColumn()
  type: ParentalType;

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
