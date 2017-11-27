import * as express from 'express';
import * as bodyParser from 'body-parser'
import * as alexaVerifier from 'alexa-verifier-middleware';
import * as logger from 'morgan';
import { AlexaSkillVerifier } from './middleware/alexaSkillVerifier';
import { AlexaRoute } from './routes/alexaRoute';

class App {
    public express : express.Application;

    constructor() {
        this.express = express();
        this.inChain();
        this.routes();
        this.outChain();
    }

    private inChain(): void {
        this.express.use(alexaVerifier);
        this.express.use(logger("combined"));
        // this.express.use(new AlexaSkillVerifier().verifier);
        this.express.use(bodyParser.json());
    }

    private outChain(): void {}

    private routes(): void {
        this.express.use('/', new AlexaRoute().router);
    }
}

export default new App().express;