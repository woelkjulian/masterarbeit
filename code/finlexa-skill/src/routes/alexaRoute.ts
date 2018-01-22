import { Router, Request, Response, NextFunction } from 'express';
import { AlexaResponseHelper } from './../model/alexa';
import { Context } from './../model/context';
import { Session } from './../model/session';

export class AlexaRoute {
    router: Router

    constructor() {
        this.router = Router();
        this.init();
      }
  
    init() {
        this.router.post('/', this.handleAlexaRequest);
    }

    private handleAlexaRequest(req: Request, res: Response, next: NextFunction) {
      
        let context = new Context(req.body);
        let result = context.execute();
        let response;
        res.setHeader('Content-Type', 'application/json');        
        
        if(result.then){                      
            result.then((say) => {              
              response = new AlexaResponseHelper(say, Session.Instance.attributes).getJSONString();                
              res.send(response);
            }).catch((error) => {
              console.log(error);
              // TODO create alexa response mit schief gelaufen
            });
        } else {         
          console.log("is no promise: ", result);
         response = new AlexaResponseHelper(result, Session.Instance.attributes).getJSONString();        
         res.send(response);         
        }     
    }

}