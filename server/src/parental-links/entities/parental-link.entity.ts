import { Couple } from 'src/couples/entities/couple.entity';
import { Individual } from 'src/individuals/entities/individual.entity';
import { ParentalType } from 'src/parental-types/entities/parental-type.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
@Unique(['parentCouple', 'child', 'olderSibling'])
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
    eager: true,
  })
  @JoinColumn()
  parentCouple: Couple;

  @ManyToOne(() => Individual, {
    onDelete: 'CASCADE',
    nullable: false,
    orphanedRowAction: 'delete',
    eager: true,
  })
  @JoinColumn()
  child: Individual;

  @OneToOne(() => ParentalLink, { nullable: true })
  @JoinColumn()
  olderSibling: ParentalLink;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
