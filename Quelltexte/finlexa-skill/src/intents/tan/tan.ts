import { IIntent } from './../../model/iIntent';
import { AtomicFactory } from './../../model/atomicFactory';
import { Validation } from './../../model/validation';
import { Say } from './../../model/say';
import { Stage } from './../../model/stage';
import { UserNotFoundError, EntityNotFoundError, AuthoriseError, TanError, AccessNotFoundError } from './../../model/errors';
import { Speech } from './speech';
import { utility } from './../../utility';
import { Session } from './../../model/session';
import { Intent } from './../intent';
import { AuthoriseIntent } from './../authorise/authorise';
import * as rp from 'request-promise';

export class TanIntent extends Intent {
  
  constructor() {
    super();            
    this.name = 'Tan';
    let slots = {
      Number: {
        name: 'Number',
        value: ''
      }          
    }
    this.atomics = new AtomicFactory().createComposite(slots, Speech.response.slots); 
    this.speech = Speech;           
  }

  canHandle(intent: IIntent): boolean {
    return this.atomics.canHandle(intent);
  }
  
  handle(): any {
    console.log("TAN handle");
    // validate all AtomicIntents of this Intent 
    return this.atomics.validate()
    .then(validations => {              
      // check if there are conflicts, if so return only conflict atomic
      // otherwise return configured max amount of responses
      let say = this.checkValidation(validations);      
      if(say.isEmpty()) {
        let tan = this.atomics.getByName('Number').value;   
        let session = Session.Instance;        
        let userId = session.get('userId');   
        let prompt = '';
        let reprompt = '';
        
        let options = {
          method: 'POST',
          uri:  utility.centralBaseUrl + 'banking/transactions/' + session.get('transactionId') + '/' + tan,
          json: true,
          body: {
            userId: userId,
            sessionId: session.get('sessionId')
          }       
        };
        return rp(options).then(transactionRequest => {
          if(transactionRequest !== undefined) {
            prompt = utility.returnRndIfArray(Speech.response.handled.prompt);
            reprompt = utility.returnRndIfArray(Speech.response.handled.reprompt);                     
          }
          return new Say().Prompt(prompt).Reprompt(reprompt);
        }).catch(error => {          
          let prompt = '';
          let reprompt = '';
          let errorBody = error.response.body;          
          if(errorBody.name === new EntityNotFoundError('').name) {
            prompt = utility.returnRndIfArray(utility.getObjectByPath(Speech.error.entity, error.message + '.prompt'));
            reprompt = utility.returnRndIfArray(utility.getObjectByPath(Speech.error.entity, error.message + '.reprompt'));
            return new Say().Prompt(prompt).Reprompt(reprompt);
          } else if(errorBody.name === new AuthoriseError('').name) {
            prompt = utility.returnRndIfArray(Speech.error.prompt);
            reprompt = utility.returnRndIfArray(Speech.error.reprompt);    
            return new AuthoriseIntent().handle();   
          } else if(errorBody.name === new UserNotFoundError('').name) {
            prompt = utility.returnRndIfArray(Speech.error.user.prompt);
            reprompt = utility.returnRndIfArray(Speech.error.user.reprompt);    
            return new Say().Prompt(prompt).Reprompt(reprompt);
          } else if(errorBody.name === new TanError('').name) {
            prompt = utility.returnRndIfArray(Speech.error.tan.prompt);
            reprompt = utility.returnRndIfArray(Speech.error.tan.reprompt);  
            return new Say().Prompt(prompt).Reprompt(reprompt);
          } else if(errorBody.name === new AccessNotFoundError('').name) {
            prompt = utility.returnRndIfArray(Speech.error.access.prompt);
            reprompt = utility.returnRndIfArray(Speech.error.access.reprompt);    
            return new Say().Prompt(prompt).Reprompt(reprompt);
          } else {
            prompt = utility.returnRndIfArray(Speech.error.prompt);
            reprompt = utility.returnRndIfArray(Speech.error.reprompt);    
            return new Say().Prompt(prompt).Reprompt(reprompt);
          }                      
        });                  
      } 
      Session.Instance.setCurrentIntent(this);
      return say;
    });  
  }
}