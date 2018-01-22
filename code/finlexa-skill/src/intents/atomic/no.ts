import { IIntent } from './../../model/iIntent';
import { Stage } from './../../model/stage';
import { HelpIntent} from './../help/help';

export class NoIntent implements IIntent {
  name: string;
  atomic: boolean;
  speech: any;
  stage: Stage;
  value: any;
  
  constructor(name: string, value: any, stage: Stage, speech: any) { 
    this.name = name;            
    this.atomic = true;
  }

  /**
   * validate Data
   */
  validate(): any {    
    
  } 
  
  canHandle(intent: IIntent): boolean {
    return false;
  }

  handle() {
    // if yes intent is handled cause there is no current intent, that can handle a yes
    return new HelpIntent().handle();
  }
}