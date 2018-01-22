import { IIntent } from './../../model/iIntent';
import { Stage } from './../../model/stage';
import { AtomicComposite } from './../../model/atomicComposite';
import { AtomicFactory } from './../../model/atomicFactory';
import { Say } from './../../model/say';
import { Speech } from './speech';
import { utility } from './../../utility';
import { Intent } from './../intent';

export class SessionEndIntent extends Intent {

  constructor() {
    super();
    this.name = 'SessionEndIntent';
    this.speech = Speech;
  }

  canHandle(intent: IIntent): boolean {
    // No atomiccomposite, so nothing to handle
    return false;
  }

  handle(): any {    
    let prompt = utility.returnRndIfArray(Speech.prompt);    
    return new Say().Prompt(prompt).ShouldEndSession(true);
  }

  toJSON(): any {
    return {
        name: this.name
    }
  }

}