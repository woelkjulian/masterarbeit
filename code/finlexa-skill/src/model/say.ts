// class/object to handle return values
// prompt
// reprompt
// card
export class Say {
    prompt: string;
    reprompt: string;
    card: any;
    shouldEndSession: boolean;

    constructor() {
        this.prompt = "";
        this.reprompt = "";
        this.shouldEndSession = false;
    }

    Prompt(str: string) {
        this.prompt += str;
        return this;
    }

    Reprompt(str: string) {
        this.reprompt += str;
        return this;
    }

    Card(card: any) {
        this.card = card;
        return this;
    }

    ShouldEndSession(b: boolean) {
      this.shouldEndSession = b;
      return this;
    }

    isEmpty(): boolean {
      if(this.prompt.length === 0 && this.reprompt.length === 0) {
        return true;
      } else {
        return false;
      }
    }
    
}