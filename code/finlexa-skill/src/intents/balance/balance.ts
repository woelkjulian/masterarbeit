import { IIntent } from './../../model/iIntent';
import { AtomicFactory } from './../../model/atomicFactory';
import { Say } from './../../model/say';
import { Speech } from './speech';
import { utility } from './../../utility';
import { Session } from './../../model/session';
import { UserNotFoundError, EntityNotFoundError, AuthoriseError } from './../../model/errors';
import { Intent } from './../intent';
import { UserIntent } from './../user/user';
import { AuthoriseIntent } from './../authorise/authorise';
import * as rp from 'request-promise';

export class BalanceIntent extends Intent {
  
  constructor() {
    super();        
    this.name = 'Balance';
    this.speech = Speech;
  }

  canHandle(intent: IIntent): boolean {
    // No atomiccomposite, so nothing to handle
    return false;
  }
  
  handle(): any {
    let userId = Session.Instance.get('userId');    
    if(userId !== undefined && userId.length > 0) {
      let sessionId = Session.Instance.get('sessionId');
      if(sessionId !== undefined && sessionId.length > 0) {
        let session = Session.Instance;
        var options = {
          method: 'POST',
          uri:  utility.centralBaseUrl + 'banking/balance',
          json: true,
          body: {
            userId: userId,
            sessionId: sessionId
          }
        };
    
        return rp(options)
        .then(balance => {
          session.reset('currentIntent');         
          let prompt = utility.format(utility.returnRndIfArray(Speech.response.prompt), balance);
          let reprompt = utility.format(utility.returnRndIfArray(Speech.response.reprompt), balance);                   
          return new Say().Prompt(prompt).Reprompt(reprompt);
        }).catch(error => {
          let prompt = '';
          let reprompt = '';
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
        return new AuthoriseIntent().handle();
      }      
    } else {
      Session.Instance.setLastIntent(this);
      return new UserIntent().handle();            
    }
  }

  toJSON(): any {
    return {
        name: this.name
    }
  }
}