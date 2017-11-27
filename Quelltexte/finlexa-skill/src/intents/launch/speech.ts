export var Speech = {
  response: {
    prompt: [
        'Hier ist Voice <phoneme alphabet="ipa" ph="Bænk">Bank</phoneme>, wer bist du?',
        '<say-as interpret-as="interjection">Willkommen</say-as> bei Voice <phoneme alphabet="ipa" ph="Bænk">Bank</phoneme>, wie ist dein Name?',
        'Hier ist Voice <phoneme alphabet="ipa" ph="Bænk">Bank</phoneme>, wer spricht?',
    ],
    reprompt: [
        'Sag mir zunächst deinen Namen, dann können wir fortfahren',
        'Ich brauche deinen Namen, um deine Anfragen zuordnen zu können',
        'Damit du den Skill richtig nutzen kannst, brauche ich deinen Namen'
    ]
  },
  help: {
    prompt: ['Launch hilfe'],
    reprompt: ['Launch hilfe']
  }
}
