import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinTable } from "typeorm";
import { User } from './user';

@Entity()
export class Access {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uuid: string;

  @Column()
  main: boolean;

  @Column()
  bankCode: string;

  @Column()
  bankLogin: string;

  @Column()
  bankName: string;

  @Column()
  pin: string;

  @Column()
  iban: string;

  @Column()  
  type: string;

  @Column()  
  name: string;

  @Column()  
  customName: string;

  @ManyToOne(type => User, user => user.accesses)
  user: User;
}

// @OneToMany(type => Photo, photo => photo.author)