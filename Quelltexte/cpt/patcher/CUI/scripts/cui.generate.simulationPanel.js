inlets = 1

var jsonData
var audioNames
var doDebug
var origin
var padding
var player
var slotSelectWidth
var window
var fontSizeIntentTitle
var fontSizeUtterance
var colourDict
var tag
var handlePlayersStateCnt = 0
    /********************************************************************************************\
    | Max message functions
    \********************************************************************************************/


function bang() {

    //
    // cleanup old scenario tabs
    //
    this.patcher.apply(removeTab);

    //
    // initialize sizes and positions
    //
    init()

    //
    // generate simulation panel according to json data
    // 
    generate()

    //
    // close scenario tab patcher windows
    //
    this.patcher.apply(closeTab);
}

function findPatchers() {
    this.patcher.applydeep(findHandlePlayersState)
}

function findHandlePlayersState(obj) {

    if (obj.subpatcher()) {
        if (obj.subpatcher().getnamed("scriptHandlePlayersState") != null) {
            post(obj.subpatcher().parentpatcher.name + " " + obj.subpatcher().parentpatcher.maxclass + "\n")
            post(obj.rect[0] + " " + obj.rect[1] + " " + obj.rect[2] + " " + obj.rect[3] + " " + "\n ")
            handlePlayersStateCnt++
            post("found HandlePlayerState cnt: " + handlePlayersStateCnt + "\n")

            post("\n")
        }
    }
}

function readJSON(path) {
    memstr = "";
    data = "";
    maxchars = 10000;
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

function setDebug(b) {
    doDebug = b;
}

/********************************************************************************************\
| Util functions
\********************************************************************************************/

function removeTab(obj) {
    if (obj.subpatcher()) {
        var parent = obj.subpatcher().parentpatcher.name
        var name = obj.subpatcher().name
        if (parent.toLowerCase() == "cui.simulationpanel" && name.toLowerCase().indexOf("scenario") != -1) {
            this.patcher.remove(obj)
        }
    }
}

function closeTab(obj) {
    if (obj.subpatcher()) {
        var parent = obj.subpatcher().parentpatcher.name
        var name = obj.subpatcher().name
        if (parent.toLowerCase() == "cui.simulationpanel" && name.toLowerCase().indexOf("scenario") != -1) {
            obj.subpatcher().message("wclose")
        }
    }
}

function init() {
    audioNames = new Array()
    doDebug = 0
    origin = { x: 0, y: 0 }

    padding = {
        players: { x: 10, y: 10 },
        patchers: { x: 30, y: 30 },
        panels: { x: 20, y: 20 }
    }
    player = { width: 300, height: 80 }
    slotSelectWidth = 100

    fontSizeIntentTitle = 18
    fontSizeUtterance = 12

    colourDict = new Dict("ui_colours")
    tag = "generateSimulationPanel"
    window = { width: this.patcher.wind.size[0], height: this.patcher.wind.size[1] }

    // subtract 80 from window height, cause window height includes max toolbars
    window.height -= 80
}

function generate() {
    for (var i in jsonData.scenarios) {
        generateScenario(this.patcher, jsonData.scenarios[i])
    }
}

function generateScenario(patcher, scenario) {
    var scenarioTab = patcher.newdefault(0, 0, "p", scenario.name)
    scenarioTab.message("showontab", 1)

    // create topbar
    var topbar = scenarioTab.subpatcher().newdefault(0, 0, "bpatcher",
        "@name", "cui.control.topbar",
        "@patching_rect", origin.x, origin.y, window.width * 2, player.height)

    // send scenario object to topbar script to build topbar audioplayers
    topbar.subpatcher().getnamed("topbarGenerationScript").message("generate", scenario)

    // create handlePlayersState which handles the activity state of audioplayers within this scenario
    // this bpatchers rect is 0,0,0,0 cause there is no need to show it
    // contains only javascript object
    post("generateScenario")
    scenarioTab.subpatcher().newdefault(0, 0, "bpatcher",
        "@name", "cui.audio.handlePlayersState",
        "@patching_rect", origin.x, origin.y, 100, 100,
        "@args", scenario.name + "updatePlayersState")

    // create Intents for this scenario
    var xPos = origin.x;
    var yPos = origin.y + topbar.rect[3] + padding.panels.y

    // check utterance length of all intents to set the Response patchers within a scenario
    // at the same y position, for esthetics
    var responseYPos
    var maxUtterancelength = 0;
    for (var j in scenario.intents) {
        if (scenario.intents[j].utterances.length > maxUtterancelength) {
            maxUtterancelength = scenario.intents[j].utterances.length
        }
    }

    // calculate response audioplayers starting yposition according to max utterance length
    responseYPos = yPos + padding.panels.y + fontSizeIntentTitle + padding.panels.y +
        (maxUtterancelength * fontSizeUtterance) + padding.panels.y

    for (var i in scenario.intents) {
        newX = generateIntent(scenarioTab, scenario, scenario.intents[i], xPos, yPos, responseYPos)
        xPos = newX
    }
}

function generateIntent(scenarioTab, scenario, intent, intentXPos, intentYPos, responseYPos) {

    // help and error intents are created within the top bar, not here
    // in that case just return the xposition parameter
    if (intent.name.indexOf("help") != -1 || intent.name.indexOf("error") != -1) {
        return intentXPos
    } else {
        var slotButtonsWidth;
        var slotsExist = false
        var responseSlots = new Array()

        // check if slots are defined in one of the intents responses
        for (var z in intent.responses) {
            var newSlots = intent.responses[z].slots
            if (newSlots != null && newSlots.length > 0) {
                slotsExist = true

                // add slots to responseSlots array if not already added
                // the responseSlots are needed to create the cui.button.generator patcher later on
                for (var jj in newSlots) {
                    var slotSaved = false
                    for (var zz in responseSlots) {
                        if (newSlots[jj] === responseSlots[zz]) {
                            slotSaved = true
                        }
                    }
                    if (!slotSaved) {
                        responseSlots.push(newSlots[jj])
                    }
                }
            }
        }

        // if there are slots, extend intent width
        if (slotsExist === true) {
            slotButtonsWidth = slotSelectWidth + padding.patchers.x
        } else {
            slotButtonsWidth = 0
        }

        // -20 cause of bottom toolbar
        var intentHeight = window.height - intentYPos
        var intentWidth = padding.patchers.x + slotButtonsWidth + player.width + padding.patchers.x
        var utteranceHeight = fontSizeUtterance * intent.utterances.length

        // check if responses exceeds window and increase intent width if necessary
        var responsesHeight = player.height + padding.players.y
        var noOfResponses = intent.responses.length
        var responsesSpace = intentHeight - (responseYPos - intentYPos)
        var noOfResponsesPerCol = Math.floor(responsesSpace / responsesHeight)

        // number of columns we need to extend
        var toExtend = (Math.floor(noOfResponses / noOfResponsesPerCol))

        // because of Math.floor, in the case of even number of responses we need to 
        // subtract one extension
        if ((toExtend % 2) == 0) {
            toExtend -= 1
        }
        var extension = toExtend * (player.width + padding.patchers.x)

        if (extension > 0) {
            intentWidth += extension
        }

        var intentTitle = scenarioTab.subpatcher().newdefault(0, 0, "comment",
            "@patching_rect", intentXPos, intentYPos + padding.panels.y, intentWidth, fontSizeIntentTitle,
            "@textcolor", 0, 0, 0, 1,
            "@fontsize", fontSizeIntentTitle,
            "@textjustification", 1)

        intentTitle.set(intent.name)

        var utterancesComment = scenarioTab.subpatcher().newdefault(0, 0, "comment",
            "@patching_rect", intentXPos + padding.patchers.x, intentYPos + padding.panels.y + fontSizeIntentTitle + padding.panels.y, intentWidth - padding.patchers.x * 2, utteranceHeight,
            "@textcolor", 0, 0, 0, 1,
            "@fontsize", fontSizeUtterance)

        for (var uIndex in intent.utterances) {
            utterancesComment.append(intent.utterances[uIndex] + "\n");
        }

        var intentPanel = scenarioTab.subpatcher().newdefault(0, 0, "panel",
            "@patching_rect", intentXPos, intentYPos, intentWidth, intentHeight,
            "@background", 1,
            "@bgfillcolor", colourDict.get("backGray"))

        // check intent priority and set panel background accordingly
        var prio = Object.keys(intent.priority)
        var prioValue = intent.priority[prio]
        intentPanel.message("border", getPriorityValue(prioValue))
        intentPanel.message("bordercolor", getPriorityColor(prio))

        this.patcher.sendtoback(intentPanel)
        var xPos = intentXPos + padding.patchers.x + slotButtonsWidth
        var yPos = responseYPos
        var cnt = 1
        for (var i in intent.responses) {
            newY = generateResponse(scenarioTab, scenario, intent, intent.responses[i], xPos, yPos)

            // if responses exceed window, wrap them in the next column
            if (cnt === noOfResponsesPerCol) {
                yPos = responseYPos
                xPos += player.width + padding.patchers.x
                cnt = 0
            } else {
                yPos = newY
            }

            // check if response got slots defined and collect them
            for (var ii in intent.responses[i].slots) {
                var exists = false;
            }
            cnt++
        }

        // create slot select patcher with collected slots from above
        var buttonGenerator = scenarioTab.subpatcher().newdefault(0, 0, "bpatcher",
            "@name", "cui.button.generator",
            "@patching_rect", intentXPos + padding.patchers.x, responseYPos, slotSelectWidth, intentHeight - (responseYPos - intentYPos) - padding.patchers.y)

        var buttonGeneratorScript = buttonGenerator.subpatcher().getnamed("buttonGenScript")
        buttonGeneratorScript.message("setIntentName", intent.name)
        buttonGeneratorScript.message("setScenarioName", scenario.name)
        buttonGeneratorScript.message("buttonGeneration", responseSlots)

        return intentXPos + intentWidth + padding.panels.x
    }

}

function generateResponse(scenarioTab, scenario, intent, response, responseXPos, responseYPos) {

    // collect slots/subject for martins slotselect patcher
    for (var name in audioNames) {
        if (response.audio === name) {
            log("generateResponse", "WARNING", "filename: " + name + " already exists! This may lead to unexpected behaviour")
        }
    }

    audioNames.push(response.audio)
        // Split.Join necessary cause the bpatcher argument takes all the words with space in between as arguments
    var phrase = response.phrase.split(" ").join("_")
    var audioplayer = scenarioTab.subpatcher().newdefault(0, 0, "bpatcher",
        "@name", "cui.audio.player",
        "@patching_rect", responseXPos, responseYPos, player.width, player.height,
        "@varname", intent.name + "_" + response.subject,
        "@args", response.subject, phrase, response.audio, scenario.name + "_" + intent.name)

    if (response.slots != null && response.slots.length > 0) {
        // audioplayer.subpatcher().getnamed("stateHandler").message("setDebug", 1)
        audioplayer.subpatcher().getnamed("stateHandler").message("init", response.slots)
    }

    return responseYPos + player.height + padding.players.y
}

function getPriorityColor(type) {
    var colourString

    if (type == "main") {
        colourString = "prioMain"
    } else if (type == "aux") {
        colourString = "prioAux"
    }
    return colourDict.get(colourString)
}

function getPriorityValue(value) {
    return Math.max(12 - 3 * value, 6)
}

function calcNumberOfResponsesPerCol(resHeight, noOfRes, space) {

    // calculate how much responses fit into given intent space
    return extendBy
}

function log(tag, type, message) {
    post("\n", tag, " || ", type, " || ", message, "\n")
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