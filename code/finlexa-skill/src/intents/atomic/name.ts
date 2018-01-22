import { IIntent } from './../../model/iIntent';
import { Stage } from './../../model/stage';
import { Say } from './../../model/say';
import { Validation } from './../../model/validation';
import { Intent } from './../intent';
import { utility } from './../../utility';

export class NameIntent implements IIntent {
  name: string;
  atomic: boolean;
  speech: any;
  stage: Stage;
  value: any;
  
  constructor(name: string, value: any, stage: Stage, speech: any) {
    this.name = name;
    this.value = value;
    this.speech = speech;
    this.atomic = true;

    if(stage !== undefined) {
      this.stage = stage;
    } else {
      this.stage = Stage.OPEN;
    }
  }

  /**
   * validate Data
   */
  validate() {    
    console.log("name validate");
    let validation = new Validation();
    if(this.value !== undefined && this.value !== null && this.value.length > 0) {
      this.stage = Stage.RESOLVED;
    }

    validation.stage = this.stage;

    switch(this.stage) {
      case Stage.OPEN:
        validation.say
        .Prompt(utility.returnRndIfArray(this.speech.open.prompt))
        .Reprompt(utility.returnRndIfArray(this.speech.open.reprompt));
        break;
      case Stage.RESOLVED:
        validation.say
        .Prompt(utility.returnRndIfArray(this.speech.resolved.prompt))
        .Reprompt(utility.returnRndIfArray(this.speech.resolved.reprompt));    
        break;     
    }
    return new Promise((resolve, reject) => {
      try {
        resolve(validation);
      } catch(e) {
        reject(e);
      }
    });
  }
  
  private update(intent: IIntent): boolean {
    if(intent.value !== undefined && intent.value.length > 0) {
      this.value = intent.value;
      this.stage = Stage.OPEN;
      return true;
    } else {
      return false;
    }
  }

  canHandle(intent: IIntent): boolean {
    if(intent instanceof NameIntent) {
      return this.update(intent);      
    } else if (intent instanceof Intent) {
      return this.update(intent.atomics.getByName(this.name));     
    } else {
      return false;
    }
  }
  handle() {}
}