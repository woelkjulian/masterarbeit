import { AtomicComposite } from './atomicComposite';
import { NumberIntent } from './../intents/atomic/number';
import { NameIntent } from './../intents/atomic/name';
import { UserNameIntent } from './../intents/atomic/userName';
import { TemplateNameIntent } from './../intents/atomic/templateName';

export class AtomicFactory {
    createComposite(slots: any, speech: any): AtomicComposite {

        let composite = new AtomicComposite('');
        for (let slot in slots) {
          if (slots.hasOwnProperty(slot)) {
            let name = slots[slot].name;
            let value = slots[slot].value;
            let stage = slots[slot].stage;
                    
            if(name === 'Name') {            
              composite.add(new NameIntent(name, value, stage, speech.name));
            } else if(name === 'Number') {          
              composite.add(new NumberIntent(name, value, stage, speech.number));
            } else if(name === 'UserName') {          
              composite.add(new UserNameIntent(name, value, stage, speech.username));
            } else if(name === 'TemplateName') {              
              composite.add(new TemplateNameIntent(name, value, stage, speech.templatename));
            }
          }          
        }

        console.log("composite: ", composite);
        return composite;
    }
}