import { IIntent } from './../../model/iIntent';
import { AtomicFactory } from './../../model/atomicFactory';
import { Say } from './../../model/say';
import { Speech } from './speech';
import { utility } from './../../utility';
import { Session } from './../../model/session';
import { Intent } from './../intent';
import { UserIntent } from './../user/user';
import * as rp from 'request-promise';

export class HelpIntent extends Intent{

  constructor() {
    super();
    this.name = 'Help';
    this.atomic = false;
  }

  canHandle(intent: IIntent): boolean {
    // No atomiccomposite, so nothing to handle
    return false;
  }
  
  handle(): any {
    let currentIntent = Session.Instance.getCurrentIntent();
    let prompt = '';
    let reprompt = '';
    let speech;
    // if(currentIntent !== null && currentIntent !== undefined) {      
    //   speech = currentIntent.speech;
    // } else {
      speech = Speech;
    // }
    prompt = utility.returnRndIfArray(speech.help.prompt);
    reprompt = utility.returnRndIfArray(speech.help.reprompt);

    return new Say().Prompt(prompt).Reprompt(reprompt);
  }
}