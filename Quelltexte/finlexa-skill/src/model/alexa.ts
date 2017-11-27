import { Say } from './say';
import { Session } from './session';

export class AlexaResponseHelper {
    response: AlexaResponse;
   
    constructor(say: Say, session: any) {
        this.response = new AlexaResponse(say, session);
        this.response.version = "1.0";
        this.response.response.shouldEndSession = say.shouldEndSession;
    }

    getJSONString(): string{
        return JSON.stringify(this.response);
    }
}

class AlexaResponse {
  version: string;
  sessionAttributes: Object;
  response: ResponseObject ;

  constructor(say: Say, session: any) {

      if(session !== null) {
          this.sessionAttributes = session;
      }
      
      this.response = new ResponseObject(say);
  }
}

class ResponseObject {
  outputSpeech: OutputSpeech; 
  // card: Card 
  reprompt: Reprompt;
  shouldEndSession: boolean;

  constructor(say: Say) {
      this.outputSpeech = new OutputSpeech(say.prompt);
      // this.card = new Card(say.card);
      this.reprompt = new Reprompt(say.reprompt);
  }
}

class Reprompt {
  outputSpeech: OutputSpeech;
  
  constructor(reprompt: any) {
      this.outputSpeech = new OutputSpeech(reprompt);
  }
}

class OutputSpeech {
  type: string;
  text: string;
  ssml: string;

  constructor(str: any) {
      this.type = "SSML";
      this.ssml = '<speak>'+str+'</speak>';
  }
}

class Card {
  type: string;
  title: string;
  content: string;
  text: string;
  image: AlexaImage;

  constructor(card: any) {
      // this.image = new AlexaImage();
  }
}

class AlexaImage {
  smallImageUrl: string;
  largeImageUrl: string;
}