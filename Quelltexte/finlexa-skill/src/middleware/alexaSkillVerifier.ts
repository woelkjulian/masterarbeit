import { Router, Request, Response, NextFunction } from 'express';

export class AlexaSkillVerifier {    

    skillID: string;

    constructor() {
      this.skillID = ''
    }

    public verifier(req: Request, res: Response, next: NextFunction) {
      // if(req.body)
    }
}