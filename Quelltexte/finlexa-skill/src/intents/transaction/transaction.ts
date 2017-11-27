import { IIntent } from './../../model/iIntent';
import { AtomicFactory } from './../../model/atomicFactory';
import { Say } from './../../model/say';
import { Stage } from './../../model/stage';
import { Validation } from './../../model/validation';
import { Speech } from './speech';
import { utility } from './../../utility';
import { Session } from './../../model/session';
import { UserNotFoundError, EntityNotFoundError, AuthoriseError, TanError, AccessNotFoundError } from './../../model/errors';
import { Intent } from './../intent';
import { YesIntent } from './../atomic/yes';
import { NoIntent } from './../atomic/no';
import { UserIntent } from './../user/user';
import { TanIntent } from './../tan/tan';
import { AuthoriseIntent } from './../authorise/authorise';
import * as rp from 'request-promise';

export class TransactionIntent extends Intent {
  
  constructor(slots: any, stage: Stage) {
    super();
    this.name = 'Transaction';
    this.atomic = false;
    this.atomics = new AtomicFactory().createComposite(slots, Speech.response.slots);    
    this.speech = Speech;            

    if(stage !== undefined && stage !== null) {
      this.stage = stage;
    } else {
      this.stage = Stage.OPEN;
    }
  }

  canHandle(intent: IIntent): boolean {
    console.log("Transaction CanHandle")
    if(intent instanceof YesIntent) {
      if(this.stage === Stage.RESOLVED) {
        this.stage = Stage.CONFIRMED;
        return true;
      }      
    } else if(intent instanceof NoIntent) {
      if(this.stage === Stage.RESOLVED) {
        this.stage = Stage.CONFLICT;
        return true;
      }
    } else {
      this.stage = Stage.OPEN;
      return this.atomics.canHandle(intent);
    }
  }  

  checkValidation(validations: Validation[]): Say {    
    let say = new Say();    

    // TODO setup config, add var "maxResponses" like variable 
    for(let i = 0; i < validations.length; i++) {      
      if(validations[i].stage === Stage.CONFLICT || validations[i].stage === Stage.UNKNOWN) {
        say.prompt = validations[i].say.prompt;
        say.reprompt = validations[i].say.reprompt;
        say.card = validations[i].say.card;
        break;
      } else {
        say
        .Prompt(validations[i].say.prompt)
        .Reprompt(validations[i].say.reprompt)
        .Card(validations[i].say.card);
        if((i-1) === validations.length) {
          say
          .Prompt(Speech.response.slots.end.open)
          .Reprompt(Speech.response.slots.end.open);
        }
      }
    }     
    return say;
  }

  handle(): any {    
    let session = Session.Instance;
    let userId = session.get('userId');

    if(userId !== undefined && userId !== null && userId.length > 0) {
      let sessionId = session.get('sessionId');
      if(sessionId !== undefined && sessionId !== null && sessionId.length > 0) {
        return this.atomics.validate().then(validations => {
          let say = this.checkValidation(validations);
          if(say.isEmpty()) {            
            let prompt = '';
            let reprompt = '';
            if(this.stage === Stage.OPEN) {
              // let user confirm transaction
              this.stage = Stage.RESOLVED;              
              prompt = utility.format(utility.returnRndIfArray(Speech.response.confirm.prompt), this.atomics.getByName('number').value, this.atomics.getByName('templatename').value);
              reprompt = utility.format(utility.returnRndIfArray(Speech.response.confirm.reprompt), this.atomics.getByName('number').value, this.atomics.getByName('templatename').value);
              session.setCurrentIntent(this);
              return new Say().Prompt(prompt).Reprompt(reprompt);
            } else if(this.stage === Stage.CONFLICT) {
              // if user said no instead of yes
              prompt = utility.returnRndIfArray(Speech.response.conflict.prompt);
              reprompt = utility.returnRndIfArray(Speech.response.conflict.reprompt);
              session.setCurrentIntent(this);
              return new Say().Prompt(prompt).Reprompt(reprompt);
            } else if(this.stage === Stage.CONFIRMED) {
              var options = {
                method: 'POST',
                uri:  utility.centralBaseUrl + 'banking/transactions',
                json: true,
                body: {
                  userId: userId,
                  templateName: this.atomics.getByName('templatename').value,
                  amount:  this.atomics.getByName('number').value,
                  sessionId: sessionId
                }
              };
            
              return rp(options).then(transactionRequest => {                               
                session.set('transactionId', transactionRequest.uuid);            
               return new TanIntent().handle();
              }).catch(error => {                                                
                let errorBody = error.response.body;          
                if(errorBody.name === new EntityNotFoundError('').name) {
                  prompt = utility.returnRndIfArray(Speech.error.entity.prompt);
                  reprompt = utility.returnRndIfArray(Speech.error.entity.reprompt);    
                  return new Say().Prompt(prompt).Reprompt(reprompt);
                } else if(errorBody.name === new AuthoriseError('').name) {
                  prompt = utility.returnRndIfArray(Speech.error.authorise.prompt);
                  reprompt = utility.returnRndIfArray(Speech.error.authorise.reprompt); 
                  return new AuthoriseIntent().handle();   
                } else if(errorBody.name === new UserNotFoundError('').name) {
                  prompt = utility.returnRndIfArray(Speech.error.user.prompt);
                  reprompt = utility.returnRndIfArray(Speech.error.user.reprompt);    
                  return new Say().Prompt(prompt).Reprompt(reprompt);
                } else {
                  prompt = utility.returnRndIfArray(Speech.error.prompt);
                  reprompt = utility.returnRndIfArray(Speech.error.reprompt);    
                  return new Say().Prompt(prompt).Reprompt(reprompt);
                }          
              });    
            } else {
              // IS THIS STATE REACHABLE?
            }                                             
          } else {
            session.setCurrentIntent(this);
            return say;
          }
        });  
      } else {
        return new AuthoriseIntent().handle();
      }          
    } else {                    
      session.setLastIntent(this);
      return new UserIntent().handle();                  
    }  
  }

  toJSON(): any {
    return {
        name: this.name,
        stage: this.stage,
        slots: this.atomics
    }
  }

}