import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinTable } from "typeorm";

@Entity()
export class SessionRequest {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uuid: string;

  @Column()
  userUuid: string;

  @Column()
  authorised: boolean;
}

// @OneToMany(type => Photo, photo => photo.author)