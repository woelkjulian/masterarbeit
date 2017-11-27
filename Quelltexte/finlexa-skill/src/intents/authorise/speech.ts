export var Speech = {
    response: {
    prompt: [
      'Bestätige zuerst deine Identität',
      'Bitte Identität über deine App bestätigen',
      'Sieh bitte auf deine Voice <phoneme alphabet="ipa" ph="Bænk">Bank</phoneme> App und bestätige deine Identität',
      'Bitte über Voice <phoneme alphabet="ipa" ph="Bænk">Bank</phoneme> App bestätigen',
    ],
    reprompt: [
      'Nachdem du bestätigt hast, kannst du einfach fortfahren',
      'Hast du schon über deine App bestätigt? Fahre fort, oder ruf einfach die Hilfe auf, wenn du nicht weiter weißt',
      'Wenn du bestätigt hast, kannst du den Skill vollständig nutzen.'
    ]
    },
    error: {
      prompt: ['Sorry, ich weiß nicht was da schief gelaufen ist, versuche es nochmal. Im Zweifels starte den Skill neu'],
      reprompt: ['Versuche es nochmal, oder starte den Skill neu. Tut mir Leid'],
      entity: {
        prompt: ['Sorry, Ich kann die aktuelle Session leider nicht finden, versuche den Skill nochmal neu zu starten'],
        reprompt: ['Starte den Voice Bank Skill erneut und versuch es nochmal']
      },
      user: {
        prompt: ['Beim Erfassen deines Namens lief anscheinend etwas schief, versuche den Skill neu zu starten'],
        reprompt: ['Starte den Skill neu und versuch es nochmal ']
      }
    }    
}
