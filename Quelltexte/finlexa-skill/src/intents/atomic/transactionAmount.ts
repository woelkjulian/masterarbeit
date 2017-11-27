// import { IIntent } from './../../model/IIntent';
// import { Stage } from './../../model/Stage';
// import { Say } from './../../model/Say';
// import { Validation } from './../../model/Validation';
// import { Intent } from './../Intent';
// import { utility } from './../../utility';
// import { AmountIntent } from './Amount';
// import { UserIntent } from './../user/user';
// import { Session } from './../../model/Session';

// var rp = require('request-promise');

// // TODO GET BALANCE AND COMPARE TO AMOUNT, IF AMOUNT > BALANCE => CONFLICT
// // Check session username, get user id and get templates
// export class TransactionAmount extends AmountIntent {
  
//   constructor(name: string, value: any, stage: Stage, speech: any) {
//     super(name, value, stage, speech);    
//   }

//   /**
//    * validate Data
//    */
//   validate(): any {    
//     let userId = Session.Instance.get('userId');

//     if(this.value !== undefined && this.value !== null && this.value.length > 0) {
     
//       var getBalance = {
//         method: 'POST',
//         uri: 'http://localhost:3100/v1/bankingbalance',
//         json: true, 
//         body: {
//           userId: userId
//         }        
//       };
    
//         return rp(getBalance).then(balance => {     
//           let validation = new Validation();              
                
//           if(balance >= this.value)       

//           switch(this.stage) {
//             case Stage.OPEN:
//               validation.say
//               .Prompt(utility.format(utility.returnRndIfArray(this.speech.open.unknown.prompt), this.value))
//               .Reprompt(utility.format(utility.returnRndIfArray(this.speech.open.unknown.reprompt), this.value));
//               break;
//             case Stage.CONFLICT:
//               validation.say
//               .Prompt(utility.returnRndIfArray(this.speech.conflict.prompt))
//               .Reprompt(utility.returnRndIfArray(this.speech.conflict.reprompt));    
//               break;
//             case Stage.RESOLVED:
//               validation.say
//               .Prompt(utility.returnRndIfArray(this.speech.resolved.prompt))
//               .Reprompt(utility.returnRndIfArray(this.speech.resolved.reprompt));   
//               break;
//           }
//           validation.stage = this.stage;  
//           return validation;        
//         }).catch(err => {
//           console.log(err);
//         });
      
//     } else {     
//       let validation = new Validation();   
//       this.stage = Stage.OPEN;
//       validation.say
//       .Prompt(utility.returnRndIfArray(this.speech.open.prompt))
//       .Reprompt(utility.returnRndIfArray(this.speech.open.reprompt));
//       validation.stage = this.stage;  

//       return new Promise((resolve, reject) => {
//         try {          
//           resolve(validation);
//         } catch(e) {
//           reject(e);
//         }
//       });
//     }
//   }
// }