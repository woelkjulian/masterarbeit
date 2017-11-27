import 'reflect-metadata';
import { Router, Request, Response, NextFunction } from 'express';
import * as express from 'express';
import { getConnection } from 'typeorm';
import { statusStrings } from './../utility';
import * as UUID from 'uuid';
import { Access } from './../model/access';
import { User } from './../model/user';
import { EntityNotFoundError, UserNotFoundError } from './../model/errors';

export class AccessRouter {
  router: express.Router

  /**
   * Initialize the AccessRouter
   */
  constructor() {
    this.router = Router({ mergeParams: true });
    this.init();
  }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    this.router.get('/', this.getAll);
    this.router.post('/', this.create);
    this.router.get('/:accessId', this.get);
    this.router.put('/:accessId', this.update);
    this.router.delete('/:accessId', this.delete);
}

  /**
   * GET all Access
   */
  public async getAll(req: Request, res: Response, next: NextFunction) {
    let UserRepo = getConnection().getRepository(User);
    let userId = req.params.userId;

    res.setHeader('Content-Type', 'application/json');
    UserRepo.findOne({uuid: userId})
    .then(user => {
      if(user !== undefined) {
        res.status(200).send(JSON.stringify(user.accesses));    
      } else {
        throw new UserNotFoundError('');
      }
    }).catch(error => {
      res.status(500).send(error);  
    });    
  }

  /**
   * GET one Access
   */
  private async get(req: Request, res: Response, next: NextFunction) {
    let AccessRepo = getConnection().getRepository(Access);

    res.setHeader('Content-Type', 'application/json');
    AccessRepo.findOne({ uuid: req.params.accessId})
    .then(foundAccess => {
      if(foundAccess !== undefined) {
        res.status(200).send(JSON.stringify(foundAccess));
      } else {
        throw new EntityNotFoundError('access');
      }      
    }).catch(error => {
      res.status(500).send(error);
    }); 
  }

  /**
   * POST new Access
   */
  private async create(req: Request, res: Response, next: NextFunction) {
    let AccessRepo = getConnection().getRepository(Access);
    let UserRepo = getConnection().getRepository(User);
    let userId = req.params.userId;
    let data = req.body;    

    res.setHeader('Content-Type', 'application/json');
    UserRepo.findOne({uuid: userId})
    .then(user => {
      if(user !== undefined) {
        let access = new Access();
        access.uuid = UUID.v4();
        access.main = data.main;
        access.bankCode = data.bankCode;
        access.bankName = data.bankName;
        access.bankLogin = data.bankLogin;        
        access.pin = data.pin;
        access.iban = data.iban;        
        access.type = data.type;
        access.user = user;
        if(data.name !== undefined && data.name !== null) {
          access.name = data.name;
        } else {
          access.name = '';
        }
        if(data.customName !== undefined && data.name !== null) {
          access.customName = data.customName;        
        } else {
          access.customName = '';
        }
      
        user.accesses.push(access);   
        return AccessRepo.save(access);
      } else {
        throw new UserNotFoundError('');
      }
    })
    .then(newAccess => {             
      let returnAccess = {          
        uuid: newAccess.uuid,                    
        bankCode: newAccess.bankCode,  
        bankName: newAccess.bankName,                   
        bankLogin: newAccess.bankLogin,       
        iban: newAccess.iban,
        main: newAccess.main,                                                        
        type: newAccess.type,           
        pin: newAccess.pin,
        name: newAccess.name,
        customName: newAccess.customName                                  
      }                                      
      res.status(201).send(JSON.stringify(returnAccess));       
    }).catch(error => {      
      res.status(500).send(error);
    });     
  }
        
  /*
  * Update Access
  */
  private async update(req: Request, res: Response, next: NextFunction) {
    let AccessRepo = getConnection().getRepository(Access);
    let UserRepo = getConnection().getRepository(User);
    let userId = req.params.userId;
    let accessId = req.params.accessId;
    let data = req.body;
  
    UserRepo.findOne({uuid: userId})
    .then(user => {
      if(user !== undefined) {
        let partialAccess = new Access();
        partialAccess.bankCode = data.bankCode;
        partialAccess.bankName = data.bankName;
        partialAccess.bankLogin = data.bankLogin;        
        partialAccess.pin = data.pin;
        partialAccess.iban = data.iban;
        partialAccess.main = data.main;
        partialAccess.type = data.type;
        partialAccess.name = data.name;
        partialAccess.customName = data.customName;
        res.setHeader('Content-Type', 'application/json');
        return AccessRepo.update({ uuid: accessId }, partialAccess);
      } else {
        throw new UserNotFoundError('');
      }
    })        
    .then(updatedAccess => {        
      // cause updatedTemplate is undefined, send back the updated template manually
      return AccessRepo.findOne({uuid: accessId})
    })
    .then(access => {            
      
      if(access !== undefined) {
        let returnAccess = {          
          uuid: access.uuid,                    
          bankCode: access.bankCode,  
          bankName: access.bankName,                   
          bankLogin: access.bankLogin,                                                                                
          pin: access.pin,   
          iban: access.iban,
          main: access.main,     
          type: access.type,
          name: access.name,
          customName: access.customName,
        }      
        res.status(200).send(JSON.stringify(returnAccess));
      } else {
        throw new EntityNotFoundError('access');
      }            
    }).catch(error => {
      res.status(500).send(error);  
    });        
  }

  /*
  * DELETE Access
  */
  private async delete(req: Request, res: Response, next: NextFunction) {
    let AccessRepo = getConnection().getRepository(Access);

    res.setHeader('Content-Type', 'application/json');
    AccessRepo.findOne({ uuid: req.params.accessId})
    .then(foundAccess => {
      if(foundAccess !== undefined) {
        return AccessRepo.remove(foundAccess);
      } else {
        throw new EntityNotFoundError('access');
      }
    })
    .then(deletedAccess => {          
      res.status(200).send(JSON.stringify(deletedAccess));
    }).catch(error => {          
      res.status(500).send(error);
    });    
  }
}

