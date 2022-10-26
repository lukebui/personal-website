import { IndividualGender } from 'src/enums/IndividualGender.enum';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Individual {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  middleName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  alias: string;

  @Column({ nullable: true })
  note: string;

  @Column({
    type: 'enum',
    enum: IndividualGender,
  })
  gender: IndividualGender;

  @Column({
    type: 'date',
    nullable: true,
  })
  dateOfBirth: Date;

  @Column({
    type: 'date',
    nullable: true,
  })
  dateOfDeath: Date;

  @Column({
    type: 'boolean',
    nullable: true,
  })
  hasDied: boolean;
}
