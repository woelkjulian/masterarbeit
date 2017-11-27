import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from './user';

@Entity()
export class Template {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uuid: string;

  @Column()
  name: string;

  @Column()
  bankName: string;

  @Column()
  bic: string;

  @Column()
  currency: string;

  @Column()
  iban: string;

  @Column()
  owner: string;

  @ManyToOne(type => User, user => user.templates)
  user: User;
}


