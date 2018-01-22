import { IIntent } from './../../model/iIntent';
import { AtomicFactory } from './../../model/atomicFactory';
import { Validation } from './../../model/validation';
import { Say } from './../../model/say';
import { Stage } from './../../model/stage';
import { Speech } from './speech';
import { utility } from './../../utility';
import { Session } from './../../model/session';
import { UserNotFoundError, EntityNotFoundError } from './../../model/errors';
import { Intent } from './../intent';
import * as rp from 'request-promise';

export class AuthoriseIntent extends Intent {
  
  constructor() {
    super();            
    this.name = 'Authorise';        
    this.speech = Speech;        
  }

  canHandle(intent: IIntent): boolean {
    return this.atomics.canHandle(intent);
  }
  
  handle(): any {            
    let options = {
      method: 'PUT',
      uri:  utility.centralBaseUrl + 'banking/sessions/' + Session.Instance.get('sessionId'),
      json: true,
      body: {
        userId: Session.Instance.get('userId')            
      }       
    };
    return rp(options).then(sessionAuthoriseRequest => {      
      Session.Instance.set('sessionId', sessionAuthoriseRequest.uuid);
      let prompt = utility.returnRndIfArray(Speech.response.prompt);
      let reprompt = utility.returnRndIfArray(Speech.response.reprompt);        
      return new Say().Prompt(prompt).Reprompt(reprompt);
    })
    .catch(error => {
      let prompt = '';
      let reprompt = '';
      if(error instanceof EntityNotFoundError) {
        prompt = utility.returnRndIfArray(Speech.error.entity.prompt);
        reprompt = utility.returnRndIfArray(Speech.error.entity.reprompt);    
      } else if(error instanceof UserNotFoundError){        
        prompt = utility.returnRndIfArray(Speech.error.user.prompt)
        reprompt = utility.returnRndIfArray(Speech.error.user.reprompt);    
      } else {        
        prompt = utility.returnRndIfArray(Speech.error.prompt);
        reprompt = utility.returnRndIfArray(Speech.error.reprompt);    
      }
      return new Say().Prompt(prompt).Reprompt(reprompt);
    }); 
  }
}