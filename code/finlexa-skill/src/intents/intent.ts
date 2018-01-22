import { IIntent } from './../model/iIntent';
import { Stage } from './../model/stage';
import { AtomicComposite } from './../model/atomicComposite';
import { Say } from './../model/say';
import { Validation } from './../model/validation';

export class Intent implements IIntent {
  name: string;
  atomic: boolean;
  atomics: AtomicComposite;
  slots: any;
  speech: any;
  stage: Stage;
  
  constructor() {
    // create atomics with atomicfactory
    this.atomic = false;
    this.name = 'Intent';
  }

  validate(): any {}

  handle(): any {}

  canHandle(intent: IIntent) {}

  checkValidation(validations: Validation[]): Say {    
    let say = new Say();    

    // TODO setup config, add var "maxResponses" like variable 
    for(let i = 0; i < validations.length; i++) {      
      if(validations[i].stage === Stage.CONFLICT) {
        say.prompt = validations[i].say.prompt;
        say.reprompt = validations[i].say.reprompt;
        say.card = validations[i].say.card;
        break;
      } else {
        say
        .Prompt(validations[i].say.prompt)
        .Reprompt(validations[i].say.reprompt)
        .Card(validations[i].say.card);
      }
    }     
    return say;
  }

  toJSON(): any {
    return {
        name: this.name,        
        slots: this.atomics
    }
  }
}