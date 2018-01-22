inlets = 1;
outlets = 1;

var jsonData;
var audioNames = new Array();
var checkBoxes = new Array();

// size of the created bpatchers in the tabs
var playerHeight = 80;
var playerWidth = 350;
var xZero = 0;
var yZero = 0;
var panelOffset = 5;
var checkBoxWidth = 10;
var checkBoxHeight = 10;

// how to get patcher window height?
var windowHeight = 1000;
var windowWidth;

function readJSON(path) {
    memstr = "";
    data = "";
    maxchars = 5000;
    var f = new File(path, "read");
    f.open();
    if (f.isopen) {
        while (f.position < f.eof) {
            memstr += f.readstring(maxchars);
        }
        f.close();
    } else {
        post("Error\n");
    }
    jsonData = JSON.parse(memstr);
    //UI = eval("("+memstr+")"); //much less secure, but could work
    post("\nJSON Read", path);
}

// create on bang
function bang() {
    cleanup();
    createFromObj(jsonData);
}

// cleanup all existing tabs
function cleanup() {
    post("\ncleanup tabs...\n");
    this.patcher.applydeep(removeTab);
    post("\n...cleaning done!\n");
}

function removeTab(obj) {
    if (obj.subpatcher()) {
        var parent = obj.subpatcher().parentpatcher.name;
        var name = obj.subpatcher().maxclass;
        post(name);
        if (parent.toLowerCase() == "cui.simulationpanel" && name == "patcher") {
            this.patcher.remove(obj);
        }
    }
}

// create all max objects depending on JSON data
function createFromObj(obj) {
    post("\nstart Panel generation...\n");
    var projectName = obj.projectName;
    var testerNames = obj.testerNames;
    var scenarios = obj.scenarios;

    for (var sIndex in scenarios) {
        var scenarioName = scenarios[sIndex].name;
        var intents = scenarios[sIndex].intents;
        var description = scenarios[sIndex].description;
        var scenarioPanelHeight = playerHeight;
        var panelXPos = xZero;
        var panelYPos = scenarioPanelHeight + panelOffset * 2;
        var responseYPos = yZero;

        var scenarioTab = this.patcher.newdefault(0, 0, "p", scenarioName);
        scenarioTab.message("showontab", 1);

        var scenarioHelpPanel = scenarioTab.subpatcher().newdefault(0, 0, "panel",
            "@patching_rect", xZero, yZero, playerWidth, scenarioPanelHeight + panelOffset, //responses.length +2 for utterance box
            "@background", 1,
            "@bgfillcolor", 0.95, 0.76, 0.26, 0.5
        );

        var scenarioErrorPanel = scenarioTab.subpatcher().newdefault(0, 0, "panel",
            "@patching_rect", xZero + playerWidth + panelOffset, yZero, playerWidth, scenarioPanelHeight + panelOffset, //responses.length +2 for utterance box
            "@background", 1,
            "@bgfillcolor", 0.95, 0.00, 0.00, 0.5
        );

        var desc = description.toString();

        for (var iIndex in intents) {
            var intentName = intents[iIndex].name;
            var utterances = intents[iIndex].utterances;
            var responses = intents[iIndex].responses;
            var utteranceHeight = 2 * playerHeight;
            var titleHeight = playerHeight / 3;

            if (intentName.toLowerCase() == "helpintent") {
                for (var rIndex in responses) {
                    var subject = responses[rIndex].subject;
                    var phrase = responses[rIndex].phrase;
                    var audio = responses[rIndex].audio;

                    // check if audio name already exists, Max needs unique names inside tester name folder
                    for (name in audioNames) {
                        if (audio === name) {
                            post("WARNING: audio: " + audio + " already exists! This may lead to unpredictable behaviour!");
                            break;
                        }
                    }
                    audioNames.push(audio);
                    var audios = audio.split("_");
                    // Split.Join necessary cause the bpatcher argument takes all the words with space in between as arguments
                    var newPhrase = phrase.split(" ").join("_");

                    var audioplayer = scenarioTab.subpatcher().newdefault(0, 0, "bpatcher",
                        "@name", "cui.audioplayer",
                        "@patching_rect", 0, 0, playerWidth - checkBoxWidth * 4, playerHeight,
                        "@args", audios[2], newPhrase, audio
                    );

                    var checkbox = scenarioTab.subpatcher().newdefault(0, 0, "radiogroup",
                        "@patching_rect", 0 + playerWidth - checkBoxWidth * 3, playerHeight / 2 - checkBoxHeight / 2, checkBoxWidth, checkBoxHeight,
                        "@itemtype", 1,
                        "@size", 1
                    );

                    checkBoxes.push(checkbox);
                }
            } else if (intentName.toLowerCase() == "errorintent") {
                for (var rIndex in responses) {
                    var subject = responses[rIndex].subject;
                    var phrase = responses[rIndex].phrase;
                    var audio = responses[rIndex].audio;

                    // check if audio name already exists, Max needs unique names inside tester name folder
                    for (name in audioNames) {
                        if (audio === name) {
                            post("WARNING: audio: " + audio + " already exists! This may lead to unpredictable behaviour!");
                            break;
                        }
                    }
                    audioNames.push(audio);
                    var audios = audio.split("_");
                    // Split.Join necessary cause the bpatcher argument takes all the words with space in between as arguments
                    var newPhrase = phrase.split(" ").join("_");

                    var audioplayer = scenarioTab.subpatcher().newdefault(0, 0, "bpatcher",
                        "@name", "cui.audioplayer",
                        "@patching_rect", playerWidth + panelOffset, 0, playerWidth - checkBoxWidth * 4, playerHeight,
                        "@args", audios[2], newPhrase, audio
                    );

                    var checkbox = scenarioTab.subpatcher().newdefault(0, 0, "radiogroup",
                        "@patching_rect", playerWidth + playerWidth - checkBoxWidth * 3, playerHeight / 2 - checkBoxHeight / 2, checkBoxWidth, checkBoxHeight,
                        "@itemtype", 1,
                        "@size", 1
                    );

                    checkBoxes.push(checkbox);
                }
            } else {
                var intentPanel = scenarioTab.subpatcher().newdefault(0, 0, "panel",
                    "@patching_rect", panelXPos, panelYPos, playerWidth, windowHeight, //responses.length +2 for utterance box
                    "@background", 1
                );

                var intentTitle = scenarioTab.subpatcher().newdefault(0, 0, "comment",
                    "@patching_rect", panelXPos, panelYPos, playerWidth, titleHeight,
                    "@textcolor", 1, 1, 1, 1,
                    "@fontsize", 18,
                    "@textjustification", 1
                );

                intentTitle.set(intentName);

                var utterancesComment = scenarioTab.subpatcher().newdefault(0, 0, "comment",
                    "@patching_rect", panelXPos, panelYPos + titleHeight, playerWidth, utteranceHeight,
                    "@textcolor", 1, 1, 1, 1
                );

                for (var uIndex in utterances) {
                    utterancesComment.append(utterances[uIndex] + "\n");
                }

                for (var rIndex in responses) {
                    responseYPos = panelYPos + utteranceHeight + rIndex * playerHeight;
                    var subject = responses[rIndex].subject;
                    var phrase = responses[rIndex].phrase;
                    var audio = responses[rIndex].audio;

                    // check if audio name already exists, Max needs unique names inside tester name folder
                    for (name in audioNames) {
                        if (audio === name) {
                            post("WARNING: audio: " + audio + " already exists! This may lead to unpredictable behaviour!");
                            break;
                        }
                    }
                    audioNames.push(audio);
                    var audios = audio.split("_");
                    // Split.Join necessary cause the bpatcher argument takes all the words with space in between as arguments
                    var newPhrase = phrase.split(" ").join("_");

                    var audioplayer = scenarioTab.subpatcher().newdefault(0, 0, "bpatcher",
                        "@name", "cui.audioplayer",
                        "@patching_rect", panelXPos, responseYPos, playerWidth - checkBoxWidth * 4, playerHeight,
                        "@args", audios[2], newPhrase, audio
                    );

                    var checkbox = scenarioTab.subpatcher().newdefault(0, 0, "radiogroup",
                        "@patching_rect", panelXPos + playerWidth - checkBoxWidth * 3, responseYPos + playerHeight / 2 - checkBoxHeight / 2, checkBoxWidth, checkBoxHeight,
                        "@itemtype", 1,
                        "@size", 1
                    );

                    checkBoxes.push(checkbox);
                }
                panelXPos += playerWidth + panelOffset;
            }
        }
    }

    // bring checkboxes to front, otherwise they wont be clickable
    for (var i = 0; i < checkBoxes.length; i++) {
        this.patcher.bringtofront(checkBoxes[i]);
    }
    post("\n...Panel generation done!\n");
}

function dict_to_jsobj(dict) {
    if (dict == null) return null;
    var o = new Object();
    var keys = dict.getkeys();
    if (keys == null || keys.length == 0) return null;

    if (keys instanceof Array) {
        for (var i = 0; i < keys.length; i++) {
            if (dict.get(keys[i]))
                var value = dict.get(keys[i]);
            post("keyValue: " + value);
            if (value && value instanceof Dict) {
                value = dict_to_jsobj(value);
            }
            o[keys[i]] = value;
        }
    } else {
        var value = dict.get(keys);

        if (value && value instanceof Dict) {
            value = dict_to_jsobj(value);
        }
        o[keys] = value;
    }

    return o;
}

/********************************************************************************************\
  JSON.parse() algorithm from Browser APIs
\********************************************************************************************/

if (typeof JSON !== "object") {
    JSON = {};
}

(function() {
    "use strict";

    var rx_one = /^[\],:{}\s]*$/;
    var rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
    var rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
    var rx_four = /(?:^|:|,)(?:\s*\[)+/g;
    var rx_escapable = /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    var rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ?
            "0" + n :
            n;
    }

    function this_value() {
        return this.valueOf();
    }

    if (typeof Date.prototype.toJSON !== "function") {

        Date.prototype.toJSON = function() {

            return isFinite(this.valueOf()) ?
                this.getUTCFullYear() + "-" +
                f(this.getUTCMonth() + 1) + "-" +
                f(this.getUTCDate()) + "T" +
                f(this.getUTCHours()) + ":" +
                f(this.getUTCMinutes()) + ":" +
                f(this.getUTCSeconds()) + "Z" :
                null;
        };

        Boolean.prototype.toJSON = this_value;
        Number.prototype.toJSON = this_value;
        String.prototype.toJSON = this_value;
    }

    var gap;
    var indent;
    var meta;
    var rep;


    function quote(string) {

        // If the string contains no control characters, no quote characters, and no
        // backslash characters, then we can safely slap some quotes around it.
        // Otherwise we must also replace the offending characters with safe escape
        // sequences.

        rx_escapable.lastIndex = 0;
        return rx_escapable.test(string) ?
            "\"" + string.replace(rx_escapable, function(a) {
                var c = meta[a];
                return typeof c === "string" ?
                    c :
                    "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
            }) + "\"" :
            "\"" + string + "\"";
    }


    function str(key, holder) {

        // Produce a string from holder[key].

        var i; // The loop counter.
        var k; // The member key.
        var v; // The member value.
        var length;
        var mind = gap;
        var partial;
        var value = holder[key];

        // If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === "object" &&
            typeof value.toJSON === "function") {
            value = value.toJSON(key);
        }

        // If we were called with a replacer function, then call the replacer to
        // obtain a replacement value.

        if (typeof rep === "function") {
            value = rep.call(holder, key, value);
        }

        // What happens next depends on the value's type.

        switch (typeof value) {
            case "string":
                return quote(value);

            case "number":

                // JSON numbers must be finite. Encode non-finite numbers as null.

                return isFinite(value) ?
                    String(value) :
                    "null";

            case "boolean":
            case "null":

                // If the value is a boolean or null, convert it to a string. Note:
                // typeof null does not produce "null". The case is included here in
                // the remote chance that this gets fixed someday.

                return String(value);

                // If the type is "object", we might be dealing with an object or an array or
                // null.

            case "object":

                // Due to a specification blunder in ECMAScript, typeof null is "object",
                // so watch out for that case.

                if (!value) {
                    return "null";
                }

                // Make an array to hold the partial results of stringifying this object value.

                gap += indent;
                partial = [];

                // Is the value an array?

                if (Object.prototype.toString.apply(value) === "[object Array]") {

                    // The value is an array. Stringify every element. Use null as a placeholder
                    // for non-JSON values.

                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || "null";
                    }

                    // Join all of the elements together, separated with commas, and wrap them in
                    // brackets.

                    v = partial.length === 0 ?
                        "[]" :
                        gap ?
                        "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" :
                        "[" + partial.join(",") + "]";
                    gap = mind;
                    return v;
                }

                // If the replacer is an array, use it to select the members to be stringified.

                if (rep && typeof rep === "object") {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        if (typeof rep[i] === "string") {
                            k = rep[i];
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (
                                    gap ?
                                    ": " :
                                    ":"
                                ) + v);
                            }
                        }
                    }
                } else {

                    // Otherwise, iterate through all of the keys in the object.

                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (
                                    gap ?
                                    ": " :
                                    ":"
                                ) + v);
                            }
                        }
                    }
                }

                // Join all of the member texts together, separated with commas,
                // and wrap them in braces.

                v = partial.length === 0 ?
                    "{}" :
                    gap ?
                    "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" :
                    "{" + partial.join(",") + "}";
                gap = mind;
                return v;
        }
    }

    // If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== "function") {
        meta = { // table of character substitutions
            "\b": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            "\"": "\\\"",
            "\\": "\\\\"
        };
        JSON.stringify = function(value, replacer, space) {

            // The stringify method takes a value and an optional replacer, and an optional
            // space parameter, and returns a JSON text. The replacer can be a function
            // that can replace values, or an array of strings that will select the keys.
            // A default replacer method can be provided. Use of the space parameter can
            // produce text that is more easily readable.

            var i;
            gap = "";
            indent = "";

            // If the space parameter is a number, make an indent string containing that
            // many spaces.

            if (typeof space === "number") {
                for (i = 0; i < space; i += 1) {
                    indent += " ";
                }

                // If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === "string") {
                indent = space;
            }

            // If there is a replacer, it must be a function or an array.
            // Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== "function" &&
                (typeof replacer !== "object" ||
                    typeof replacer.length !== "number")) {
                throw new Error("JSON.stringify");
            }

            // Make a fake root object containing our value under the key of "".
            // Return the result of stringifying the value.

            return str("", { "": value });
        };
    }


    // If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== "function") {
        JSON.parse = function(text, reviver) {

            // The parse method takes a text and an optional reviver function, and returns
            // a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

                // The walk method is used to recursively walk the resulting structure so
                // that modifications can be made.

                var k;
                var v;
                var value = holder[key];
                if (value && typeof value === "object") {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


            // Parsing happens in four stages. In the first stage, we replace certain
            // Unicode characters with escape sequences. JavaScript handles many characters
            // incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            rx_dangerous.lastIndex = 0;
            if (rx_dangerous.test(text)) {
                text = text.replace(rx_dangerous, function(a) {
                    return "\\u" +
                        ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

            // In the second stage, we run the text against regular expressions that look
            // for non-JSON patterns. We are especially concerned with "()" and "new"
            // because they can cause invocation, and "=" because it can cause mutation.
            // But just to be safe, we want to reject all unexpected forms.

            // We split the second stage into 4 regexp operations in order to work around
            // crippling inefficiencies in IE's and Safari's regexp engines. First we
            // replace the JSON backslash pairs with "@" (a non-JSON character). Second, we
            // replace all simple value tokens with "]" characters. Third, we delete all
            // open brackets that follow a colon or comma or that begin the text. Finally,
            // we look to see that the remaining characters are only whitespace or "]" or
            // "," or ":" or "{" or "}". If that is so, then the text is safe for eval.

            if (
                rx_one.test(
                    text
                    .replace(rx_two, "@")
                    .replace(rx_three, "]")
                    .replace(rx_four, "")
                )
            ) {

                // In the third stage we use the eval function to compile the text into a
                // JavaScript structure. The "{" operator is subject to a syntactic ambiguity
                // in JavaScript: it can begin a block or an object literal. We wrap the text
                // in parens to eliminate the ambiguity.

                j = eval("(" + text + ")");

                // In the optional fourth stage, we recursively walk the new structure, passing
                // each name/value pair to a reviver function for possible transformation.

                return (typeof reviver === "function") ?
                    walk({ "": j }, "") :
                    j;
            }

            // If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError("JSON.parse");
        };
    }
}());