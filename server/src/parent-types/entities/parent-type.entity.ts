import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ParentType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;
}
