import { IIntent } from './../../model/iIntent';
import { Stage } from './../../model/stage';
import { Say } from './../../model/say';
import { Validation } from './../../model/validation';
import { Intent } from './../intent';
import { utility } from './../../utility';
import { NameIntent } from './name';
import { UserIntent } from './../user/user';
import { Session } from './../../model/session';
import * as rp from 'request-promise';

// var rp = require('request-promise');

export class UserNameIntent extends NameIntent {
  
  constructor(name: string, value: any, stage: Stage, speech: any) {
    super(name, value, stage, speech);           
  }

  /**
   * validate Data
   */
  validate(): any {          
    if(this.value !== undefined && this.value !== null && this.value.length > 0) {
      var options = {
        method: 'GET',
        uri:  utility.centralBaseUrl + 'users',
        json: true        
      };
  
    return rp(options)
      .then(users => {   
        let foundUsers = new Array<{name: string; id: string;}>();
        let validation = new Validation();        
        users.forEach(user => {          
          if(user.firstName.toLowerCase() === this.value.toLowerCase()) {                      
            foundUsers.push({name: user.firstName, id: user.uuid});            
          }
      
          if(foundUsers.length > 1) {
            this.stage = Stage.CONFLICT;
            this.value = foundUsers;
          } else if(foundUsers.length === 1) {
            this.stage = Stage.RESOLVED;
            this.value = foundUsers[0].name;
            Session.Instance.set('userId', foundUsers[0].id);
          } else {
            this.stage = Stage.OPEN;          
          }    
        });    

        switch(this.stage) {
          case Stage.OPEN:
            validation.say
            .Prompt(utility.format(utility.returnRndIfArray(this.speech.open.unknown.prompt), this.value))
            .Reprompt(utility.format(utility.returnRndIfArray(this.speech.open.unknown.reprompt), this.value));
            break;
          case Stage.CONFLICT:
            validation.say
            .Prompt(utility.returnRndIfArray(this.speech.conflict.prompt))
            .Reprompt(utility.returnRndIfArray(this.speech.conflict.reprompt));    
            break;
          case Stage.RESOLVED:
            validation.say
            .Prompt(utility.returnRndIfArray(this.speech.resolved.prompt))
            .Reprompt(utility.returnRndIfArray(this.speech.resolved.reprompt));   
            break;
        }
        validation.stage = this.stage;        
        return validation;        
      }).catch(err => {
        console.log(err);
      });  
    } else {        
      let validation = new Validation();
      this.stage = Stage.OPEN;
      validation.say
      .Prompt(utility.returnRndIfArray(this.speech.open.prompt))
      .Reprompt(utility.returnRndIfArray(this.speech.open.reprompt));  
      validation.stage = this.stage;          
      
      return new Promise((resolve, reject) => {
        try {          
          resolve(validation);
        } catch(e) {
          reject(e);
        }
      });     
    }           
  }
}