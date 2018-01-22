'use strict';
/*
provides helper functions
*/

// module that allows to find object values via string paths
var objectPath = require('object-path');

export var utility = {

    // centralBaseUrl: 'https://172.30.17.29/v1/',
    centralBaseUrl: 'INSERT_BACKEND_URL_HERE',
    // centralBaseUrl: 'http://localhost:3100/v1/',
    getObjectByPath: function(obj, path) {
        return objectPath.get(obj, path);
    },
    /*
    in order to provide more flexible and diverse responses within a skill, it is common
    to define an array with multiple response choices (e.g. at speech.js) and select one random response.
    */
    returnRndIfArray: function(obj) {
        if (obj instanceof Array) {
            var index = Math.floor(Math.random() * ((obj.length - 1) - 0 + 1)) + 0;
            return obj[index];
        } else {
            return obj;
        }
    },
    /*
    Sometimes you want to have placeholders for specific values in your responses.
    Compareable to a sprintf function, you can add a "{0}" to a response text and replace it
    */
    format: function(format, ...values) {
        var args = Array.prototype.slice.call(arguments, 1);
        return format.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    },
    nullConditional: function(firstValue, secondValue) {
        if (firstValue == null) {
            return secondValue;
        }
        return firstValue;
    },
    /*
    in order to place special text fragments with a defined chance to your responses just before they are sent
    to an AVS device you can add markers like <path:to:speechartefact:15> to your response text.
    By using this function, those markers will be replaced with a chance (here 15%).
    They are replaced with an artefact of the object path seperated by ":".
    An example for this can be found at the "IntentName" sample intent.
    see src/intents/IntentName/speech.js
    and src/intents/IntentName/handler.js
    */
    injectSpeechArtefacts: function(str, artefacts) {
        // search for artefact markers

        // TODO change to pattern below
        // TODO change in blueprint
        var pattern = "<[\\w+:]+\\d{1,3}>";
        return str.replace(/\<.*?:(\d{1,3})\>/g, function(match, number) {
            // split markers <mark1:mark2:15> in object path and chance
            var artfs = match.slice(1, -1).split(":");
            var artfsPath = "";
            var artfsChance = Number(artfs[artfs.length - 1]);

            for (var i = 0; i < artfs.length - 1; i++) {
                artfsPath += artfs[i];
                if (i < artfs.length - 2) {
                    artfsPath += ".";
                }
            }
            var rand = Math.floor(Math.random() * 100) + 0;

            // check if we got a replacement here
            if (rand <= artfsChance) {
                // get the speechArtefacts from the artefact marker path
                var artfArray = objectPath.get(artefacts, artfsPath);
                var index = Math.floor(Math.random() * (artfArray.length - 1)) + 0;
                return artfArray[index];
            } else {
                return "";
            }
        });
    }

}

