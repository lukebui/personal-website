import { IndividualGender } from 'src/enums/IndividualGender.enum';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Couple } from 'src/couples/entities/couple.entity';
import { ParentChildRelationship } from 'src/parent-child-relationships/entities/parent-child-relationship.entity';

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

  @Column({ nullable: true, type: 'longtext' })
  note: string;

  @Column({
    type: 'enum',
    enum: IndividualGender,
    nullable: true,
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

  @OneToMany(() => ParentChildRelationship, (parent) => parent.child, {
    cascade: true,
  })
  parents: ParentChildRelationship[];

  @OneToMany(() => Couple, (couple) => couple.partner1 || couple.partner2)
  spouses: Couple[];

  @Column({
    asExpression: `concat_ws(' ',lastName, middleName, firstName)`,
  })
  fullName: string;
}
