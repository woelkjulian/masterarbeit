import { IIntent } from './iIntent';
import { LaunchIntent} from './../intents/launch/launch';
import { SessionEndIntent} from './../intents/sessionEnd/sessionEnd';
import { Intent } from './../intents/intent';
import { HelpIntent } from './../intents/help/help';
import { StopIntent } from './../intents/stop/stop';
import { BalanceIntent } from './../intents/balance/balance';
import { TransactionIntent } from './../intents/transaction/transaction';
import { UserIntent } from './../intents/user/user';
import { TanIntent } from './../intents/tan/tan';
import { NameIntent } from './../intents/atomic/name';
import { NumberIntent } from './../intents/atomic/number';
import { TemplateNameIntent } from './../intents/atomic/templateName';
import { YesIntent } from './../intents/atomic/yes';
import { NoIntent } from './../intents/atomic/no';

export class IntentFactory {
    public createIntent(request: any): IIntent {
        if(request.type === 'LaunchRequest') {
          console.log("create LaunchRequest");
          return new LaunchIntent();
        } else if(request.type === 'SessionEndedRequest') {          
          return new SessionEndIntent();
        } else if(request.type === 'IntentRequest') {
          console.log("IntentFactory create: ", request.intent);
          if(request.intent.name === 'AMAZON.HelpIntent') {
            return new HelpIntent();  
          } else if(request.intent.name === 'AMAZON.StopIntent') {
            return new StopIntent();  
          } else if(request.intent.name === 'AMAZON.YesIntent') {
            let name = 'Yes';    
            return new YesIntent(name, null, null, null);  
          } else if(request.intent.name === 'AMAZON.NoIntent') {
            let name = 'No';
            return new NoIntent(name, null, null, null);  
          } else if(request.intent.name === 'Transaction') {
            let stage;
            if(request.intent.stage !== undefined && request.intent.stage !== null) {
              stage = request.intent.stage;
            } else {
              stage = null;
            }
            return new TransactionIntent(request.intent.slots, stage);
          } else if(request.intent.name === 'Balance') {
            return new BalanceIntent();          
          } else if(request.intent.name === 'User') {
            console.log("create USER INTENT")
            return new UserIntent();
          } else if(request.intent.name === 'Tan') {
            return new TanIntent();
          } else if(request.intent.name === 'NameIntent') {
            let name = 'Name';
            let value = request.intent.slots[name].value;                        
            let stage = request.intent.slots[name].stage;                                    
            return new NameIntent(name, value, stage, undefined);
          } else if(request.intent.name === 'NumberIntent') {
            let name = 'Number';
            let value = request.intent.slots[name].value;                        
            let stage = request.intent.slots[name].stage;                                    
            return new NumberIntent(name, value, stage, undefined);
          } else if(request.intent.name === 'TemplateNameIntent') {
            let name = 'TemplateName';
            let value = request.intent.slots[name].value;                        
            let stage = request.intent.slots[name].stage;                                    
            return new TemplateNameIntent(name, value, stage, undefined);
          }
        }        
    }
}