import { Stage } from './stage';
import { Validation } from './validation';

export interface IIntent {

    name: string;
    atomic: boolean;
    speech: any;
    stage: Stage;
    value?: any;
    
    /**
     * validate Data
     */
    validate(): any

    /**
     * handle
     */
    handle(): any;

    canHandle(intent: IIntent): any;  
}
