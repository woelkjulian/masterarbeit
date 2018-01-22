export var Speech = {
  response: {
    slots: {
      number: {
        open: {
          prompt: ['Bitte TAN eingeben', 'Gib jetzt bitte die TAN ein'],
          reprompt: ['Du findest die TAN auf deinem Handy, die Nachricht müsste bereits da sein', 'Sieh auf dein Handy und such nach der TAN Nachricht'],          
        },       
        resolved: {
          prompt: [''],
          reprompt: ['']
        }
      }
    },
    handled: {
      prompt: ['Ok, die Transaktion wurde durchgeführt'],
      reprompt: ['Transaktion abgeschlossen, was kann ich sonst noch für dich tun?']
    },
    nothandled: {
      prompt: ['Sorry, die TAN war richtig, jedoch ist was schief gelaufen'],
      reprompt: ['Kann ich noch etwas für dich tun?']
    },
    tanwrong: {
      prompt: ['Die eingegebene TAN ist leider falsch, versuch es bitte nochmal'],
      reprompt: ['Versuch es bitte nochmal, anscheinend war die eingegebene TAN nicht richtig']
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
      session: {
        prompt: ['Sorry, Ich kann die aktuelle Session leider nicht finden, versuche den Skill nochmal neu zu starten'],
        reprompt: ['Starte den Voice Bank Skill erneut und versuch es nochmal']
      },
      request: {
        prompt: ['Sorry, Ich kann die Anfrage leider nicht finden, versuche den Skill nochmal neu zu starten'],
        reprompt: ['Starte den Voice Bank Skill erneut und versuch es nochmal']
      },
      template: {
        prompt: ['Sorry, Ich kann das Template leider nicht finden, versuche den Skill nochmal neu zu starten'],
        reprompt: ['Starte den Voice Bank Skill erneut und versuch es nochmal']
      }
    },
    user: {
      prompt: ['Beim Erfassen deines Namens lief anscheinend etwas schief, versuche den Skill neu zu starten'],
      reprompt: ['Starte den Skill neu und versuch es nochmal ']
    },
    access: {
      prompt: ['Sorry, aber es wurde kein Bankzugang gefunden. Prüfe bitte, ob du in deiner App einen Bankzugang als Hauptkonto eingerichtet hast'],
      reprompt: ['Logge dich in deiner App ein, überprüfe die Bankzugänge. Du erkennst dein Hauptkonto an dem blauen Rand auf der linken Seite ']
    },
    tan: {
      prompt: ['Die eingegebene TAN war nicht korrekt, versuche bitte die Überweisung erneut durchzuführen'],
      reprompt: ['Laute Umgebungsgeräusche können eventuell fehlerhafte Eingaben hervorrufen. Versuche es erneut'],
    }
  },
  help: {
    prompt: ['TAN hilfe'],
    reprompt: ['TAN hilfe']
  }
}
