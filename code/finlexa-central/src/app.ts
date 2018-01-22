import * as express from 'express';
import * as bodyParser from 'body-parser'
import * as logger from 'morgan';
import 'reflect-metadata';
import { FirebaseService } from './service/firebaseService';
import { DbService } from './service/dbService';
import { UserRouter } from './routes/userRouter';
import { TemplateRouter } from './routes/templateRouter';
import { AccessRouter } from './routes/accessRouter';
import { BankingRouter } from './routes/bankingRouter';

class App {
  public express : express.Application;
  public firebaseService : FirebaseService;
  public dbService : DbService;

  constructor() {
    this.express = express();
    this.dbService = DbService.Instance;
    this.firebaseService = FirebaseService.Instance;
    this.inChain();
    this.routes();
    this.outChain();
  }

  private inChain(): void {    
    this.express.use(logger("combined"));
    this.express.use(bodyParser.json());
  }

  private outChain(): void {
      
  }

  private routes(): void{
    this.express.use('/v1/users', new UserRouter().router);    
    this.express.use('/v1/users/:userId/templates', new TemplateRouter().router);
    this.express.use('/v1/users/:userId/accesses', new AccessRouter().router);    
    this.express.use('/v1/banking', new BankingRouter().router);
  }
}

export default new App().express;



