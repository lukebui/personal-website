import { Expose } from 'class-transformer';
import { IndividualGender } from 'src/enums/IndividualGender.enum';
import { Parent } from 'src/parents/entities/parent.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import * as _ from 'lodash';

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

  @OneToMany(() => Parent, (parent) => parent.child, {
    cascade: true,
  })
  parents: Parent[];

  @OneToMany(() => Parent, (parent) => parent.parent, {
    cascade: true,
  })
  children: Parent[];

  @Expose()
  public get fullName() {
    return _.compact([this.lastName, this.middleName, this.firstName]).join(
      ' ',
    );
  }
}
