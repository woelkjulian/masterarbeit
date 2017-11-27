import 'reflect-metadata';
import { Router, Request, Response, NextFunction } from 'express';
import * as express from 'express';
import { getConnection } from 'typeorm';
import { statusStrings } from './../utility';
import * as UUID from 'uuid';

import { Template } from './../model/template';
import { User } from './../model/user';
import { EntityNotFoundError, UserNotFoundError } from './../model/errors';

export class TemplateRouter {
  router: express.Router

  /**
   * Initialize the UserRouter
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
    this.router.get('/:templateId', this.get);
    this.router.put('/:templateId', this.update);
    this.router.delete('/:templateId', this.delete);
}

  /**
   * GET all Templates
   */
  public async getAll(req: Request, res: Response, next: NextFunction) {
    let UserRepo = getConnection().getRepository(User);
    let userId = req.params.userId;
    
    res.setHeader('Content-Type', 'application/json');
    UserRepo.findOne({uuid: userId})
    .then(user => {
      if(user !== undefined) {        
        res.status(200).send(JSON.stringify(user.templates));    
      } else {
        throw new UserNotFoundError('');
      }
    }).catch(error => {      
      res.status(500).send(error);  
    });    
  }

  /**
   * GET one Template
   */
  private async get(req: Request, res: Response, next: NextFunction) {
    let TemplateRepo = getConnection().getRepository(Template);

    res.setHeader('Content-Type', 'application/json');    
    TemplateRepo.findOne({ uuid: req.params.templateId})
    .then(foundTemplate => {      
      if(foundTemplate !== undefined) {
        res.status(200).send(JSON.stringify(foundTemplate));
      } else {
        throw new EntityNotFoundError('template');
      }      
    }).catch(error => {      
      res.status(500).send(error);
    }); 
  }

  /**
   * POST new Template
   */
  private async create(req: Request, res: Response, next: NextFunction) {
    let TemplateRepo = getConnection().getRepository(Template);
    let UserRepo = getConnection().getRepository(User);
    let userId = req.params.userId;
    let data = req.body;    

    res.setHeader('Content-Type', 'application/json');
    UserRepo.findOne({uuid: userId})
    .then(user => {
      if(user !== undefined) {
        let template = new Template();
        template.uuid = UUID.v4();
        template.name = data.name;
        template.bic = data.bic;
        template.iban = data.iban;
        template.currency = "EUR";
        template.owner = data.owner;
        template.bankName = data.bankName;
        template.user = user;
        user.templates.push(template);
        return TemplateRepo.save(template);
      } else {
        throw new UserNotFoundError('');
      }
    })        
    .then(newTemplate => {          
      let returnTemplate = {          
        uuid: newTemplate.uuid,                    
        name: newTemplate.name,                   
        bankName: newTemplate.bankName,                      
        bic: newTemplate.bic,                    
        currency: newTemplate.currency,                      
        iban: newTemplate.iban,                      
        owner: newTemplate.owner      
      }                              
      res.status(201).send(JSON.stringify(returnTemplate));          
    }).catch(error => {                    
      res.status(500).send(error);
    });    
  }
        
  /*
  * Update Template
  */
  private async update(req: Request, res: Response, next: NextFunction) {
    let TemplateRepo = getConnection().getRepository(Template);
    let UserRepo = getConnection().getRepository(User);
    let userId = req.params.userId;
    let templateId = req.params.templateId;
    let data = req.body;    

    res.setHeader('Content-Type', 'application/json');
    UserRepo.findOne({uuid: userId})
    .then(user => {
      if(user !== undefined) {
        let partialTemplate = new Template();
        partialTemplate.name = data.name;
        partialTemplate.bic = data.bic;
        partialTemplate.iban = data.iban;
        partialTemplate.owner = data.owner;
        partialTemplate.bankName = data.bankName;
        
        return TemplateRepo.update({ uuid: templateId }, partialTemplate);
      } else {
        throw new UserNotFoundError('');
      }
    })
    .then(updatedTemplate => {  
      // cause updatedTemplate is undefined, send back the updated template manually
      return TemplateRepo.findOne({uuid: templateId});
    })
    .then(template => {            
      let returnTemplate;
      if(template !== undefined) {
        returnTemplate = {          
          uuid: template.uuid,                    
          name: template.name,                   
          bankName: template.bankName,                      
          bic: template.bic,                    
          currency: template.currency,                      
          iban: template.iban,                      
          owner: template.owner      
        }   
        res.status(200).send(JSON.stringify(returnTemplate));
      } else {
        throw new EntityNotFoundError('template');
      }      
    }).catch(error => {
      res.status(500).send(error);  
    });                           
  }

  /*
  * DELETE Template
  */
  private async delete(req: Request, res: Response, next: NextFunction) {
    let TemplateRepo = getConnection().getRepository(Template);    
    
    res.setHeader('Content-Type', 'application/json');    
    TemplateRepo.findOne({ uuid: req.params.templateId})
    .then(foundTemplate => {
      if(foundTemplate !== undefined) {
        return TemplateRepo.remove(foundTemplate);
      } else {
        throw new EntityNotFoundError('template');
      }
    })        
    .then(deletedTemplate => {          
      if(deletedTemplate !== undefined) {
        res.status(200).send(JSON.stringify(deletedTemplate));
      } else {
        throw new Error('error deleting template');
      }       
    }).catch(error => {        
      res.status(500).send(error);
    });             
  }
}

