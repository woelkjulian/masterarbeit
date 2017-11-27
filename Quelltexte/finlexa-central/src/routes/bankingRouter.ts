import 'reflect-metadata';
import { Router, Request, Response, NextFunction } from 'express';
import * as express from 'express';
import { getConnection } from 'typeorm';
import { statusStrings } from './../utility';
import * as UUID from 'uuid';
import * as btoa from 'btoa';

import { FirebaseService } from './../service/firebaseService';
import { User } from './../model/user';
import { Template } from './../model/template';
import { TransactionRequest } from './../model/transactionRequest';
import { SessionRequest } from './../model/sessionRequest';
import { AuthoriseError, EntityNotFoundError, TanError, UserNotFoundError, AccessNotFoundError} from './../model/errors';
import * as rp from 'request-promise';

// var rp = require('request-promise');

var mbMockUrl = 'https://multibanking-mock.dev.adorsys.de/bankaccesses/';


export class BankingRouter {
  router: express.Router
  
  /**
   * Initialize the UserRouter
   */
  constructor() {
    this.router = Router();
    this.init();
  }

  //TODO add stages to Requests? create TAN for Transaction, handle requests within alexa skill
  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {    
    this.router.get('/sessions', this.getSessions);
    this.router.post('/sessions', this.createSession);
    this.router.get('/sessions/:sessionId', this.getSession);
    this.router.put('/sessions/:sessionId', this.resendSession);
    this.router.post('/sessions/:sessionId', this.authoriseSession);        
    this.router.post('/balance', this.getBalance);        
    this.router.get('/transactions', this.getTransactionRequests);
    this.router.post('/transactions', this.createTransactionRequest);
    this.router.get('/transactions/:transactionId', this.getTransactionRequest);    
    this.router.post('/transactions/:transactionId/:tan', this.confirmTransactionRequestWithTan);
  }

  private getSessions(req: Request, res: Response, next: NextFunction) {    
    let SessionRepo = getConnection().getRepository(SessionRequest);
    res.setHeader('Content-Type', 'application/json');
    
    SessionRepo.find()
    .then(srs => {
      if(srs !== undefined) {        
        res.status(200).send(JSON.stringify(srs));
      } else {
        throw new EntityNotFoundError('session');
      } 
    }).catch(error => {
      res.status(500).send(JSON.stringify(error));
    });
  }

  private createSession(req: Request, res: Response, next: NextFunction) {    
    let SessionRepo = getConnection().getRepository(SessionRequest);
    let UserRepo = getConnection().getRepository(User);
    res.setHeader('Content-Type', 'application/json');

    UserRepo.findOne({uuid: req.body.userId})
    .then(user => {
      if(user !== undefined) {        
        let sr = new SessionRequest();
        sr.uuid = UUID.v4();          
        sr.userUuid = user.uuid;       
        sr.authorised = false;       
        return Promise.all([SessionRepo.save(sr), user]);
      } else {
        throw new UserNotFoundError('');
      }
    })            
    .then(([newSr, user]) => {      
      let title = 'Bank Voice - Identität bestätigen';
      let body =  'Bitte Alexa Bank Voice Session mit Fingerabdruck autorisieren';
      let type = 'authorise';
      FirebaseService.Instance.sendMessage(user.token, title, body, type, newSr.uuid);            
      res.status(201).send(newSr);
    }).catch(error => {
      res.status(500).send(JSON.stringify(error));
    });             
  }

  private getSession(req: Request, res: Response, next: NextFunction) {    
    let SessionRepo = getConnection().getRepository(SessionRequest);
    res.setHeader('Content-Type', 'application/json');
    let sessionId = req.params.sessionId;
    
    SessionRepo.findOne({uuid: sessionId})
    .then(sr => {
      if(sr !== undefined) {        
        res.status(200).send(JSON.stringify(sr));
      } else {
        throw new EntityNotFoundError('session');
      } 
    }).catch(error => {
      res.status(500).send(JSON.stringify(error));
    });
  }

  private authoriseSession(req: Request, res: Response, next: NextFunction) {    
    let SessionRepo = getConnection().getRepository(SessionRequest);
    let UserRepo = getConnection().getRepository(User);
    let userId = req.body.userId;
    let sessionId = req.params.sessionId
    res.setHeader('Content-Type', 'application/json');

    SessionRepo.findOne({uuid: sessionId})
    .then(sr => {
      if(sr !== undefined) {        
        if(sr.userUuid === userId)
        {
          sr.authorised = true;        
        }        
        return Promise.all([SessionRepo.update({uuid: sr.uuid}, sr), sr]);
      } else {
        throw new EntityNotFoundError('session');
      }
    })            
    .then(([update, sr]) => {                        
      res.status(201).send('session authorised');
    }).catch(error => {
      res.status(500).send(JSON.stringify(error));
    });             
  }

  private resendSession(req: Request, res: Response, next: NextFunction) {    
    let SessionRepo = getConnection().getRepository(SessionRequest);
    let UserRepo = getConnection().getRepository(User);
    let userId = req.body.userId;
    res.setHeader('Content-Type', 'application/json');

    SessionRepo.findOne({uuid: req.params.sessionId, userUuid: userId})
    .then(sr => {
      if(sr !== undefined) {        
        return Promise.all([UserRepo.findOne({uuid: userId}), sr]);       
      } else {
        throw new EntityNotFoundError('session');
      }
    })            
    .then(([user, sr]) => {     
      if(user !== undefined) {                  
        let title = 'Bank Voice - Identität bestätigen';
        let body =  'Bitte Alexa Bank Voice Session mit Fingerabdruck autorisieren';
        let type = 'authorize';
        FirebaseService.Instance.sendMessage(user.token, title, body, type, sr.uuid);
        res.status(200).send('resend session authorise');
      } else {
        throw new UserNotFoundError('');
      }
    }).catch(error => {
      res.status(500).send(JSON.stringify(error));
    });             
  }

  private getBalance(req: Request, res: Response, next: NextFunction) {        
    let SessionRepo = getConnection().getRepository(SessionRequest); 
    let UserRepo = getConnection().getRepository(User);    
    let userId = req.body.userId;
    let sessionId = req.body.sessionId;
    res.setHeader('Content-Type', 'application/json');

    SessionRepo.findOne({uuid: sessionId, userUuid: userId})
    .then(session => {
      if(session !== undefined) {        
        if(session.authorised === true) {          
          return UserRepo.findOne({uuid: session.userUuid});
        } else {
          throw new AuthoriseError('');
        }
      } else {
        throw new EntityNotFoundError('session');
      }
    })
    .then(user => {    
      if(user !== undefined) {        
        let access;
        user.accesses.forEach(userAccess => {
          if(userAccess.main === true) {
            access = userAccess;
          }
        });
        if(access !== null && access !== undefined) {              
          let bankCode = access.bankCode;
          let iban = access.iban;
          // Base64 encode 'login_bankcode:pin'
          let token = btoa(access.bankLogin + '_' + access.bankCode + ':' + access.pin);
          var balanceOptions = {  
            method: 'GET',
            uri: mbMockUrl + bankCode +'/accounts/'+iban,
            json: true,
            headers: {
              Accept: 'application/json',
              Authorization: 'Basic ' + token             
            }
          };

          console.log("options: ", balanceOptions);
          // get balance from multibanking mock service
          return rp(balanceOptions);
        } else {
          throw new AccessNotFoundError('');
        }
      } else {
        throw new UserNotFoundError('');
      }
    })
    .then(bankAccount => {                   
      console.log("balance is ", bankAccount);  
      res.status(200).send(bankAccount.bankAccountBalance.availableHbciBalance.toString());                       
    }).catch(error => {
      console.log(error);
      res.status(500).send(JSON.stringify(error));
    });            
  }

  private getTransactionRequests(req: Request, res: Response, next: NextFunction) {    
    let TransactionRequestRepo = getConnection().getRepository(TransactionRequest);
  
    res.setHeader('Content-Type', 'application/json');
    TransactionRequestRepo.find()
    .then(transactionRequests => {
      res.status(200).send(transactionRequests);
    }).catch(error => {
      res.status(500).send(JSON.stringify(error));
    });
  }

  private getTransactionRequest(req: Request, res: Response, next: NextFunction) {    
    let TransactionRequestRepo = getConnection().getRepository(TransactionRequest);
    let requestId = req.params.transactionId;
    
    res.setHeader('Content-Type', 'application/json');
    TransactionRequestRepo.findOne({uuid: requestId})
    .then(tr => {   
      if(tr !== undefined) {
        res.status(200).send(JSON.stringify(tr));      
      } else {
        throw new EntityNotFoundError('transaction');
      }      
    }).catch(error => {
      res.status(500).send(JSON.stringify(error));
    });
  }

  private createTransactionRequest(req: Request, res: Response, next: NextFunction) {    
    let TransactionRequestRepo = getConnection().getRepository(TransactionRequest);
    let SessionRepo = getConnection().getRepository(SessionRequest);
    let UserRepo = getConnection().getRepository(User);    
    let userId = req.body.userId;
    let sessionId = req.body.sessionId;
    let templateName = req.body.templateName;
    let amount =req.body.amount;
    res.setHeader('Content-Type', 'application/json');

    SessionRepo.findOne({uuid: sessionId, userUuid: userId})
    .then(session => {
      if(session !== undefined) {
        if(session.authorised === true) {
          return UserRepo.findOne({uuid: session.userUuid});
        } else {
          throw new AuthoriseError('session');
        }
      } else {
        throw new EntityNotFoundError('session');
      }
    })    
    .then(user => {
      if(user !== undefined) {
        let templateId;
        user.templates.forEach(template => {
          if(template.name.toLowerCase() === templateName.toLowerCase()) {
            templateId = template.uuid;
          }
        }); 
        let tr = new TransactionRequest();
        tr.uuid = UUID.v4();
        tr.templateUuid = templateId;
        tr.userUuid = user.uuid;
        tr.amount = amount;
        tr.tan = Math.floor(Math.random() * 1000000).toString(); 
        return Promise.all([TransactionRequestRepo.save(tr), user]);
      } else {
        throw new UserNotFoundError('');
      }
    })
    .then(([newTr, user]) => {     
      let title = newTr.tan;
      let body = 'TAN Nummer für Transaktion';
      let type = 'tan';
      FirebaseService.Instance.sendMessage(user.token, title, body, type, newTr.uuid);
      res.status(201).send(JSON.stringify(newTr));
    }).catch(error => {
      res.status(500).send(JSON.stringify(error));
    });              
  }

  private confirmTransactionRequestWithTan(req: Request, res: Response, next: NextFunction) {    
    let TransactionRequestRepo = getConnection().getRepository(TransactionRequest);
    let SessionRepo = getConnection().getRepository(SessionRequest);
    let UserRepo = getConnection().getRepository(User);    
    let TemplateRepo = getConnection().getRepository(Template);    
    let requestId = req.params.transactionId;
    let tan = req.params.tan;
    let userId = req.body.userId;       
    let sessionId = req.body.sessionId;
    res.setHeader('Content-Type', 'application/json');
    
    SessionRepo.findOne({uuid: sessionId, userUuid: userId})
    .then(session => {
      if(session !== undefined) {
        if(session.authorised === true) {
          return TransactionRequestRepo.findOne({uuid: requestId})
        } else {
          throw new AuthoriseError('session');
        }
      } else {
        throw new EntityNotFoundError('session');
      }
    })          
    .then(tr =>  {                        
      if(tr !== undefined) {        
        if(tr.userUuid === userId) { 
          if(tr.tan === tan) {                                       
            return Promise.all([tr, UserRepo.findOne({uuid: tr.userUuid}), TemplateRepo.findOne({uuid: tr.templateUuid})])
          } else {
            throw new TanError('match');  
          }
        } else {
          throw new UserNotFoundError('match');
        }
      } else {
        throw new EntityNotFoundError('request');
      }
    })   
    .then(([tr, user, template]) => {        
      if(user !== undefined) {        
        if(template !== undefined) {
          let access;
          user.accesses.forEach(userAccess => {
            if(userAccess.main === true) {
              access = userAccess;
            }
          });
          if(access !== null && access !== undefined) {
            let bankCode = access.bankCode;
            let iban = access.iban;          
            let token = btoa(access.bankLogin + '_' + access.bankCode + ':' + access.pin);
            let date = new Date().toISOString().slice(0,10);          
            var transactionOptions = {  
              method: 'POST',
              uri: mbMockUrl + bankCode +'/accounts/'+iban+'/bookings',
              json: true,
              headers: {
                ContentType: 'application/json',
                Accept: 'application/json',
                Authorization: 'Basic ' + token               
              },
              body: {
                amount: tr.amount,
                usage: "powered by finlexa",
                customerRef: "finlexa",
                bookingDate: date,
                valutaDate: date,
                text: "powered by finlexa",
                otherAccount: {
                  bankName: template.bankName,
                  bic: template.bic,
                  currency: template.currency,
                  iban: template.iban,
                  owner: template.owner                              
                }
              }
            }
            return Promise.all([rp(transactionOptions), tr]);     
          } else {
            throw new AccessNotFoundError('');
          }                                               
        } else {
          throw new EntityNotFoundError('template');
        }
      } else {
        throw new EntityNotFoundError('template');
      }      
    })
    .then(([transaction, tr]) => {               
      res.status(200).send(JSON.stringify(tr));        
    })        
    .catch(error => {            
      res.status(500).send(JSON.stringify(error));
    });    
  }
}