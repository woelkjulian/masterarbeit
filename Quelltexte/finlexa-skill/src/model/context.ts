import { IIntent } from './iIntent';
import { Session } from './session';
import { IntentFactory } from './intentFactory';

export class Context {

    currentIntent: IIntent;

    constructor(alexaRequest: any) {
      let requestIntent =  new IntentFactory().createIntent(alexaRequest.request);
      let session = Session.Instance;
      session.setSession(alexaRequest.session);
      let sessionIntent = session.getCurrentIntent();       
      
      if(sessionIntent !== null && sessionIntent !== undefined) {
        this.currentIntent = sessionIntent;
      }

      console.log("currentIntent: ", this.currentIntent);
      if(this.currentIntent !== undefined) {
        if((requestIntent.atomic === true) || (this.currentIntent.name === requestIntent.name)) {
          console.log("isAtomic or same Intent");
          if(this.currentIntent.canHandle(requestIntent)) {
            console.log("can Handle");
          } else {
            console.log("can not Handle");        
            this.currentIntent = new IntentFactory().createIntent(alexaRequest.request);    
          }
        } else {
          // save current context in session?
          console.log("is different intent");
          this.currentIntent = requestIntent;
        }
      } else {
        console.log("no session, or atomic -> create new intent");
        this.currentIntent = new IntentFactory().createIntent(alexaRequest.request);
      }
    }

    public execute(): any {
        return this.currentIntent.handle();                
    }
}