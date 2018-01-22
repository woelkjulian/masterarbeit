import { IIntent } from './iIntent';
import { Intent } from './../intents/intent';
import { Stage } from './stage';
import { Validation } from './validation';

export class AtomicComposite implements IIntent {
    private list: IIntent[];
    name: string;
    atomic: boolean;
    stage: Stage;
    speech: any;
    
    constructor(name: string) {
        this.list = [];
        this.name = name;
        this.stage = Stage.OPEN;
    }

    validate(): any {            
        return Promise.all(this.list.map(atomic => {          
          return atomic.validate();
        }));              
    }

    canHandle(intent: IIntent): boolean {
      let ret = false;
      for(var i = 0; i < this.list.length; i++) {          
        if(this.list[i].canHandle(intent)) {           
          ret = true;         
        }  
      }      
      return ret;
    }

    public add(intent: IIntent): void {
        this.list.push(intent);
    }

    public getByName(name: string): IIntent {
      let ret;
      for(var i = 0; i < this.list.length; i++) {                  
        if(this.list[i].name.toLowerCase() === name.toLowerCase()) {
          ret = this.list[i];
        }
      } 
      return ret;
    }

    toJSON(): any {
      let atomics = new Object();
      for(var i = 0; i < this.list.length; i++) {                
        let atomic = {
          name: this.list[i].name,
          value: this.list[i].value,
          stage: this.list[i].stage
        }
        atomics[this.list[i].name] = atomic;        
      }
      return atomics;
    }

    handle() {}   
}
