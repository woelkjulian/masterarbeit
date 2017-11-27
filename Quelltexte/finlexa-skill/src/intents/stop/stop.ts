import { IIntent } from './../../model/iIntent';
import { AtomicFactory } from './../../model/atomicFactory';
import { Say } from './../../model/say';
import { Speech } from './speech';
import { utility } from './../../utility';
import { Session } from './../../model/session';
import { Intent } from './../intent';
import { UserIntent } from './../user/user';
import * as rp from 'request-promise';

export class StopIntent extends Intent{

  constructor() {
    super();
    this.name = 'Stop';
  }
  
  canHandle(intent: IIntent): boolean {
    // No atomiccomposite, so nothing to handle
    return false;
  }
  
  handle(): any {        
    let prompt = utility.returnRndIfArray(Speech.prompt);    
    return new Say().Prompt(prompt).ShouldEndSession(true);
  }
}