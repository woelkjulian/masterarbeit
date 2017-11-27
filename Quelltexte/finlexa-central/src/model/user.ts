import { Template } from './template';
import { Access } from './access';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinTable } from "typeorm";

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uuid: string;

  @Column()
  email: string;

  @Column()
  secret: string;

  @Column("text")
  firstName: string;

  @Column("text")
  lastName: string;

  @Column("text")
  token: string;s

  @JoinTable()
  @OneToMany(type => Template, template => template.user, {
      eager: true
  })
  templates: Template[];

  @JoinTable()
  @OneToMany(type => Access, access => access.user, {
      eager: true
  })
  accesses: Access[];
}

// @OneToMany(type => Photo, photo => photo.author)