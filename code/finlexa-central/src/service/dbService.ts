import { createConnection, Connection, EntityManager, Repository } from 'typeorm';
import { User } from './../model/user';
import 'reflect-metadata';

export class DbService {
  private static instance: DbService;

  constructor() {}
  
  static get Instance() {
    if (this.instance === null || this.instance === undefined) {
      this.instance = new DbService();
      createConnection({
        type: "postgres",
        host: "172.30.145.22",
        // host: "0.0.0.0",
        port: 5432,
        username: "postgres",
        password: "postgres",
        database: "finlexa",
        entities: [
          __dirname + "./../model/*.js"
        ],
        synchronize: true,
      }).then(async connection => {        
        console.log("Database connection established")
      }).catch(error => console.log(error));
    }
    return this.instance;
  }
}