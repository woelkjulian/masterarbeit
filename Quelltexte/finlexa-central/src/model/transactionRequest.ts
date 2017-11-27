import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinTable } from "typeorm";

@Entity()
export class TransactionRequest {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uuid: string;

  @Column()
  userUuid: string;

  @Column()
  templateUuid: string;

  @Column()
  amount: string;

  @Column()
  tan: string;
}

// @OneToMany(type => Photo, photo => photo.author)