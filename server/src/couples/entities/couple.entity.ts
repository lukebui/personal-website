import { Individual } from 'src/individuals/entities/individual.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Couple {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Individual, { eager: true })
  partner1: Individual;

  @ManyToOne(() => Individual, { eager: true })
  partner2: Individual;

  @Column()
  stillMarried: boolean;

  @Column({
    asExpression: `
      case when partner1Id < partner2Id then concat_ws('-', partner1Id, partner2Id)
        else concat_ws('-', partner2Id, partner1Id) end
    `,
    unique: true,
  })
  partnerIds: string;
}
