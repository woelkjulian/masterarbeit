export var Speech = {
  response: {
    prompt: [
      'Dein Kontostand beträgt {0} Euro. <say-as interpret-as="interjection">yay.</say-as>',
      'Du hast <break time="1s"/> <say-as interpret-as="interjection">na sieh mal einer an</say-as> <break time="1s"/> {0} Euro auf dem Konto',
      '{0} Euro sind auf deinem Konto',
      '{0} Euro sind auf deinem Konto',
      'Du hast {0} Euro auf deinem Konto',
      'Dein Kontostand beträgt {0} Euro',
      'Du hast. <break time="1s"/> Moment <break time="1s"/> komm näher ran. <break time="2s"/> <amazon:effect name="whispered">{0} Euro.</amazon:effect>'
    ],
    reprompt: [
      'Du hast {0} Euro auf dem Konto. Wie kann ich sonst noch helfen?',
      'Sonst noch was?',
      'Kann ich dir noch anderweitig helfen?',
      'Was möchtest du jetzt tun?'
    ]
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
    prompt: ['Kontostand hilfe'],
    reprompt: ['Kontostand hilfe']
  }
}
