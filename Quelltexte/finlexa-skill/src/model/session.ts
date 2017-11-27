import { IIntent } from './iIntent';
import { IntentFactory } from './intentFactory';
 
export class Session {
    
  private static instance: Session;
  new: boolean;
  sessionId: string;
  application: SessionApplication;
  attributes: any;
  user: User;
  
  constructor() {}
  
  static get Instance(): Session {
    if (this.instance === null || this.instance === undefined) {
      this.instance = new Session();  
    } 
    return this.instance;
  }

  setSession(session: any) {
    this.new = session.new;
    this.sessionId = session.sessionId;
    this.application = new SessionApplication(session.application);
    if(session.attributes !== null && session.attributes !== undefined) {
      this.attributes = session.attributes;
    } else {
      this.attributes = {};
    }
    this.user = session.user;    
  }

  set(key: string, value: any): void {
      this.attributes[key] = value;
  }

  get(key: string): any {
      return this.attributes[key];
  }

  authorised(): boolean {
    if(this.get('authorised') == true) {
      return true;
    }else {
      return false;
    }
  }

  haveUserName(): boolean {
    if(this.get('username') !== undefined) {
      return true;
    } else {
      return false;
    }
  }

  getCurrentIntent(): IIntent | undefined {
    let ret; 
    if(this.attributes !== undefined && this.attributes !== null) {
      if(this.attributes["currentIntent"] !== undefined && this.attributes["currentIntent"] !== null) {        
        let intentStage;
        if(this.attributes['currentIntent'].stage !== undefined && this.attributes['currentIntent'].stage !== null) {
          intentStage = JSON.parse(this.attributes['currentIntent'].stage);
        } else {
          intentStage = null;
        }
        let request = {            
          type: 'IntentRequest',
          stage: intentStage,
          intent: JSON.parse(this.attributes['currentIntent'])  
        };

        console.log("session getCurrentIntent: request", request);
        ret =  new IntentFactory().createIntent(request);
      } else {
        ret = undefined;
      }       
    } else {
      ret = undefined;
    }

    console.log("session getCurrentIntent: intent: ", ret);
    
    return ret;
  }

  getLastIntent(): IIntent {
    let ret; 
    if(this.attributes["lastIntent"] !== undefined && this.attributes["lastIntent"] !== null) {        
      let request = {            
        type: 'IntentRequest',
        intent: this.attributes['lastIntent']  
      };
      ret =  new IntentFactory().createIntent(request);
    } 
    return ret;
  }

  getIntent(name: string): IIntent {
    let ret; 
    if(this.attributes[name] !== undefined) {        
      let request = {            
        type: 'IntentRequest',
        intent: this.attributes[name]  
      };
      ret =  new IntentFactory().createIntent(request);
    } 
    return ret;
  }

  setCurrentIntent(intent: IIntent): void {      
    console.log("setCurrentIntent, intent: ", intent);
    console.log("setCurrentIntent, attributes: ", this.attributes);
    if(this.attributes === undefined) {
      this.attributes = {};
    }
    this.attributes['currentIntent'] = JSON.stringify(intent);
    
  }

  setLastIntent(intent: IIntent): void {      
    if(this.attributes === undefined) {
      this.attributes = {};
    }
    this.attributes['lastIntent'] = JSON.stringify(intent);
  }

  setIntent(name: string, intent: IIntent): void {  
    if(this.attributes === undefined) {
      this.attributes = {};
    }    
    this.attributes[name] = intent;
  }

  reset(name: string): void {
    if(this.attributes === undefined) {
      this.attributes = {};
    }
    this.attributes[name] = null;
  }
}

class SessionApplication {
    applicationId: string;

    constructor(application: any) {
        this.applicationId = application.applicationId;
    }
}

class User {
    userId: string;
    accessToken: string;
    permissions: Permissions;

    constructor(user: any) {
        this.permissions = new Permissions(user.permissions);
    }
}

class Permissions {
    consentToken: string;

    constructor(permissions: any) {
        this.consentToken = permissions.consentToken;
    }
}