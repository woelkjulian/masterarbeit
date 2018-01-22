import { IIntent } from './../../model/iIntent';
import { Stage } from './../../model/stage';
import { AtomicComposite } from './../../model/atomicComposite';
import { AtomicFactory } from './../../model/atomicFactory';
import { Say } from './../../model/say';
import { Speech } from './speech';
import { utility } from './../../utility';
import { Intent } from './../intent';
import { Session } from './../../model/session';
import { UserIntent } from './../user/user';

export class LaunchIntent extends Intent {
  
  constructor() {
    super();
    this.name = 'LaunchIntent';
    this.speech = Speech;
  }

  canHandle(intent: IIntent): boolean {
    // No atomiccomposite, so nothing to handle
    return false;
  }

  handle(): any {    
    let session = Session.Instance;    
    session.setCurrentIntent(new UserIntent());
    let prompt = utility.returnRndIfArray(Speech.response.prompt);
    let reprompt = utility.returnRndIfArray(Speech.response.reprompt);
    return new Say().Prompt(prompt).Reprompt(reprompt);
  }

  toJSON(): any {
    return {
        name: this.name
    }
  }

}