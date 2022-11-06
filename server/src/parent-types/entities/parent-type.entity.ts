import { ParentalLink } from 'src/parental-links/entities/parental-link.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class ParentType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @OneToMany(() => ParentalLink, (parentalLink) => parentalLink.type, {
    onDelete: 'RESTRICT',
  })
  parentalLinks: ParentalLink[];
}
