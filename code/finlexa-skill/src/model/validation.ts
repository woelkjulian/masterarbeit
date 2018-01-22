import { Stage } from './stage';
import { Say } from './say';

export class Validation {
  stage: Stage;
  say: Say;

  constructor() {
    this.say = new Say();
  }
}