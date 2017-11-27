export var Speech = {
  response: {
      common: {
          and: " und ",
          or: ", oder"
      },
      slots: {
          start: {
              open: "Ich benötige noch",
              resolved: "Meinst du",
              confirmed: ""
          },
          end: {
              open: "überweisen?",
              resolved: "",
              confirmed: ""
          },
          templatename: {
              open: {
                prompt: [', an welchen Template Namen'],
                reprompt: [',an welchen Template Namen'],                
              },
              conflict: {
                prompt: ['{0}'],
                reprompt: ['{0}']
              },
              unknown: {
                prompt: ['Template {0} wurde noch nicht angelegt.', 'Ich kann das Template nicht finden. Sicher, dass es bereits angelegt wurde?'],
                reprompt: ['Du musst das Template {0} zuerst anlegen'],
              },
              resolved: {
                prompt: [''],
                reprompt: ['']
              }
          },
           number: {
            open: {
              prompt: [', wie viel'],
              reprompt: [', wie viel']
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
      confirm: {
        prompt: [
          '{0} Euro an {1}, ja?.'
        ],
        reprompt: [
          'Bitte bestätige die Überweisung <break time="1s"/> {0} Euro an {1} mit. Ja.'          
        ]
      },
      conflict: {
        prompt: [
          'Ok, gib mir einfach die neuen Daten'
        ],
        reprompt: [
          'Du kannst mir die neuen Daten für die Überweisung einfach geben.'
        ]
      }
  },
  error: {
    prompt: ['Sorry, ich weiß nicht was da schief gelaufen ist, versuche es nochmal. Im Zweifels starte den Skill neu'],
    reprompt: ['Versuche es nochmal, oder starte den Skill neu. Tut mir Leid'],
    authorise: {
      prompt: ['Bei der Autorisierung der Session kam es anscheinend zu Problemen. Versuch es nochmal'],
      reprompt: ['Ansonsten versuch bitte den Voice Bank Skill neu zu starten. Das tut mir Leid']
    },
    entity: {
      prompt: ['Sorry, Ich kann die aktuelle Session leider nicht finden, versuche den Skill nochmal neu zu starten'],
      reprompt: ['Starte den Voice Bank Skill erneut und versuch es nochmal']
    },
    user: {
      prompt: ['Beim Erfassen deines Namens lief anscheinend etwas schief, versuche den Skill neu zu starten'],
      reprompt: ['Starte den Skill neu und versuch es nochmal ']
    }
  },
  help: {
    prompt: ['Transaktion hilfe'],
    reprompt: ['Transaktion hilfe']
  }
}
