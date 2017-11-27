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

// TODO TEMPLATE NAME INTENT
// Check session username, get user id and get templates
export class TemplateNameIntent extends NameIntent {
  
  constructor(name: string, value: any, stage: Stage, speech: any) {
    super(name, value, stage, speech);    
  }

  /**
   * validate Data
   */
  validate(): any {    
    let userId = Session.Instance.get('userId');

    if(this.value !== undefined && this.value !== null && this.value.length > 0) {
     
        var getUser = {
          method: 'GET',
          uri: utility.centralBaseUrl + 'users/' + userId,
          json: true        
        };
    
        return rp(getUser)
        .then(user => {     
          let validation = new Validation();
          let foundTemplates = new Array();      
          user.templates.forEach(template => {
            if(template.name.toLowerCase() === this.value.toLowerCase()) {
              foundTemplates.push(template.name);
            }
          });
       
          if(foundTemplates.length > 1) {
            this.stage = Stage.CONFLICT;
            this.value = foundTemplates;
          } else if(foundTemplates.length === 1) {
            this.stage = Stage.RESOLVED;
            this.value = foundTemplates[0];
          } else {
            this.stage = Stage.UNKNOWN;
          }        

          switch(this.stage) {
            case Stage.UNKNOWN:
              validation.say
              .Prompt(utility.format(utility.returnRndIfArray(this.speech.unknown.prompt), this.value))
              .Reprompt(utility.format(utility.returnRndIfArray(this.speech.unknown.reprompt), this.value));
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