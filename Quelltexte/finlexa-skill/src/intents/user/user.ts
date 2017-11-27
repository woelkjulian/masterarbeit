import { IIntent } from './../../model/iIntent';
import { AtomicFactory } from './../../model/atomicFactory';
import { Validation } from './../../model/validation';
import { Say } from './../../model/say';
import { Stage } from './../../model/stage';
import { Speech } from './speech';
import { utility } from './../../utility';
import { Session } from './../../model/session';
import { Intent } from './../intent';
import { UserNotFoundError } from './../../model/errors';
import * as rp from 'request-promise';

export class UserIntent extends Intent {
  
  constructor() {
    super();            
    this.name = 'User';
    let slots = {
      UserName: {
        name: 'UserName',
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
    // validate all AtomicIntents of this Intent 
    return this.atomics.validate().then(validations => {      
      // check if there are conflicts, if so return only conflict atomic
      // otherwise return configured max amount of responses
      let say = this.checkValidation(validations);  
    
      if(say.isEmpty()) {
        let username = this.atomics.getByName('UserName').value;
        Session.Instance.set('username', username);

        let options = {
          method: 'POST',
          uri:  utility.centralBaseUrl + 'banking/sessions',
          json: true,
          body: {
            userId: Session.Instance.get('userId')            
          }       
        };
        return rp(options).then(sessionAuthoriseRequest => {      
          Session.Instance.set('sessionId', sessionAuthoriseRequest.uuid);
          say
          .Prompt(utility.format(utility.returnRndIfArray(Speech.response.found.prompt), username ))
          .Reprompt(utility.format(utility.returnRndIfArray(Speech.response.found.reprompt), username ));        
          return say;
        })
        .catch(error => {          
          let prompt = '';
          let reprompt = '';
          let errorBody = error.response.body;          
             
          if(errorBody.name === new UserNotFoundError('').name) {
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
        Session.Instance.setCurrentIntent(this);
        return say;
      }
    });  
  
    
  }
}