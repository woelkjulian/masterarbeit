inlets = 1;
outlets = 1;

var num = 0;
var k = 0;
var menubutton = new Array(128);
var messagemerge;
var thesender;
var resetbutton;
var setvar;
var intentName;
var scenarioName;
var verticalButtonDistance = 15;
var button = { width: 100, height: 40 };
var colourDict = new Dict("ui_colours")

function setIntentName(name) {
    intentName = name
}

function setScenarioName(name) {
    scenarioName = name
    post("SetScenarioName: " + scenarioName)
}

function buttonGeneration() {
    myAwesomeArray = arrayfromargs(arguments);
    num = myAwesomeArray.length;
    if (num) { // bail if no arguments
        var resetbutton = this.patcher.newdefault(0, 0 + (k * 50),
            "textbutton",
            "@bgcolor", colourDict.get("primaryOrange"),
            "@fontsize", 16,
            "@mode", 0,
            "@textoncolor", 0, 0, 0, 1.0,
            "@text", "Reset",
            "@textjustification", 0
        );
        setvar = this.patcher.newobject("message", 0, 250, 30, 10,
            0
        );

        messagemerge = this.patcher.newdefault(100, 100,
            "sprintf",
            intentName,
            "%s",
            "%s"
        );

        thesender = this.patcher.newdefault(100, 130,
            "send",
            scenarioName + "updatePlayersState"
        );

        this.patcher.connect(resetbutton, 0, setvar, 0);
        this.patcher.connect(messagemerge, 0, thesender, 0);

        for (var k = 0; k < num; k++) { // create the new button objects, connect them to one another
            var valueAtIndexk = myAwesomeArray[k];
            menubutton[k] = this.patcher.newdefault(0, 0 + (k * 50),
                "textbutton",
                "@bgcolor", colourDict.get("buttonGray"),
                "@bgoncolor", colourDict.get("primaryGreen"),
                "@fontsize", 16,
                "@presentation", 1,
                "@presentation_rect", 0, 7 + (k * (verticalButtonDistance + button.height)), button.width, button.height,
                "@mode", 1,
                "@usebgoncolor", 1,
                "@textcolor", 0, 0, 0, 1.0,
                "@textoncolor", 0, 0, 0, 1.0,
                "@text", "" + valueAtIndexk,
                "@texton", "" + valueAtIndexk,
                "@textjustification", 0
            );

            this.patcher.connect(setvar, 0, menubutton[k], 0);
            this.patcher.connect(menubutton[k], 0, messagemerge, 0);
            this.patcher.connect(menubutton[k], 1, messagemerge, 1);
            this.patcher.bringtofront(menubutton[k]);
        }
        //Set position and format for resetbutton
        resetbutton.presentation(1);
        resetbutton.presentation_rect(0, 7 + (k * (verticalButtonDistance + button.height)), button.width, button.height);
        resetbutton.patching_rect(0, 7 + (k * (verticalButtonDistance + button.height)), button.width, button.height);
        this.patcher.bringtofront(resetbutton);
    }
}