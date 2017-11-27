import 'reflect-metadata';
import { Router, Request, Response, NextFunction } from 'express';
import * as express from 'express';
import { getConnection } from 'typeorm';
import { statusStrings } from './../utility';
import * as UUID from 'uuid';

import { User } from './../model/user';
import { Template } from './../model/template';
import { Access } from './../model/access';
import { TemplateRouter } from './templateRouter';
import { EntityNotFoundError, UserNotFoundError } from './../model/errors';

export class UserRouter {
  router: express.Router

  /**
   * Initialize the UserRouter
   */
  constructor() {
    this.router = Router();
    this.init();
  }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    this.router.get('/', this.getAll);
    this.router.post('/', this.create);
    this.router.get('/:userId', this.get);
    this.router.put('/:userId', this.update);
    this.router.delete('/:userId', this.delete);
}

  /**
   * GET all Users
   */
  public async getAll(req: Request, res: Response, next: NextFunction) {
    let UserRepo = getConnection().getRepository(User);
    
    res.setHeader('Content-Type', 'application/json');
    UserRepo.find()
    .then(users => {      
      res.status(200).send(JSON.stringify(users));
    }).catch(error => {      
      res.status(500).send(error);
    });
  }

  /**
   * GET one User
   */
  private async get(req: Request, res: Response, next: NextFunction) {
    let UserRepo = getConnection().getRepository(User);
    let id = req.params.userId;    
    
    res.setHeader('Content-Type', 'application/json');    
    UserRepo.findOne({ uuid: id })
    .then(user => {          
      if(user !== undefined) {
        res.status(200).send(JSON.stringify(user));
      } else {
        throw new UserNotFoundError('');
      }
    }).catch(error => {          
      res.status(500).send(error);
    });    
  }

  /**
   * POST new User
   */
  private async create(req: Request, res: Response, next: NextFunction) {
    let UserRepo = getConnection().getRepository(User);
    let data = <User>req.body;
    let user = new User();
    user.uuid = UUID.v4();
    user.email = data.email;
    user.secret = data.secret;
    user.firstName = data.firstName;
    user.lastName = data.lastName;
    user.token = data.token;

    res.setHeader('Content-Type', 'application/json');
    UserRepo.save(user)
    .then( newUser => {              
      res.status(201).send(JSON.stringify(newUser));
    }).catch(error => {          
      res.status(500).send(JSON.stringify(error));
    });    
  }

  /*
  * Update User
  */
  private async update(req: Request, res: Response, next: NextFunction) {
    let UserRepo = getConnection().getRepository(User);
    let id = req.params.userId;  
    let partialUser = new User();
    partialUser.email = req.body.email;
    partialUser.secret = req.body.secret;
    partialUser.firstName = req.body.firstName;
    partialUser.lastName = req.body.lastName;
    partialUser.token = req.body.token;
      
    res.setHeader('Content-Type', 'application/json');    
    UserRepo.update({ uuid: id }, partialUser)
    .then(updatedUser => {        
      // cause updatedTemplate is undefined, send back the updated template manually
      return UserRepo.findOne({uuid: id});
    })
    .then(user => {            
      let returnUser;
      if(user !== undefined) {
        returnUser = {          
          email: user.email,
          secret: user.secret,
          firstName: user.firstName,
          lastName: user.lastName,              
        }  
        res.status(200).send(JSON.stringify(returnUser));
      } else {
        throw new UserNotFoundError('');
      }       
    }).catch(error => {
      res.status(500).send(error);  
    });
  }

  /*
  * DELETE User
  */
  private async delete(req: Request, res: Response, next: NextFunction) {
    let UserRepo = getConnection().getRepository(User);
    let TemplateRepo = getConnection().getRepository(Template);
    let AccessRepo = getConnection().getRepository(Access);

    res.setHeader('Content-Type', 'application/json');        
    UserRepo.findOne({ uuid: req.params.userId })
    .then(foundUser => {
      if(foundUser !== undefined) {      
        // delete users templates and accesses first, to prevent reference errors while deleting user      
        return Promise.all([TemplateRepo.remove(foundUser.templates),  AccessRepo.remove(foundUser.accesses), foundUser]);        
      } else {            
        throw new UserNotFoundError('');
      }
    })
    .then(([deletedTemplates, deletedAccesses, foundUser]) => {                  
      if(deletedTemplates !== undefined && deletedAccesses !== undefined) {
        return UserRepo.remove(foundUser);        
      } else {
        throw new Error('error deleting templates and accesses');
      } 
    })
    .then(deletedUser => {
      if(deletedUser !== undefined) {
        res.status(200).send(JSON.stringify(deletedUser));
      } else {
        throw new Error('error deleting user');
      }
    })        
    .catch(error => {              
      res.status(500).send(error);
    });      
  }
}

