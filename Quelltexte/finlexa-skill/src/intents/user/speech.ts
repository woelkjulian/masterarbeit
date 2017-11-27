export var Speech = {
  response: {
      common: {
          and: " und ",
          or: ", oder"
      },
      slots: {         
          username: {
            open: {
              prompt: ['Wie ist dein Name?', 'Wer spricht?'],
              reprompt: ['Wie heißt du?', 'Wer bist du?'],
              unknown: {
                prompt: ['{0} ist nicht registriert.', 'Ich kann dich nicht finden. Sicher, dass du dich registriert hast?'],
                reprompt: ['Du musst dich zuerst registrieren'],
              }
            },
            conflict: {
              prompt: ['{0}'],
              reprompt: ['{0}']
            },
            resolved: {
              prompt: [''],
              reprompt: ['']
            }
          }
      },
      found:{
        prompt: ['Bestätige zunächst deine Identität {0}. Sieh auf deine Voice Bank App, .'],
        reprompt:['{0} bestätige über deine Voice Bank App, dass du mit mir sprichst.']
      }
  },
  error: {
    prompt: ['Sorry, ich weiß nicht was da schief gelaufen ist, versuche es nochmal. Im Zweifels starte den Skill neu'],
    reprompt: ['Versuche es nochmal, oder starte den Skill neu. Tut mir Leid'],    
    user: {
      prompt: ['Beim Erfassen deines Namens lief anscheinend etwas schief, versuche den Skill neu zu starten'],
      reprompt: ['Starte den Skill neu und versuch es nochmal ']
    }
  },
  help: {
    prompt: ['User hilfe'],
    reprompt: ['User hilfe']
  }
}
