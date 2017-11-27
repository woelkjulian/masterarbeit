inlets = 1;
var slot;
var bpatchers = [];
var intent;
var activate;
var doDebug = 0;
var tag = "playersStateHandler";

function setDebug(b) {
    doDebug = b;
}

// create on bang
function updatePlayers(a) {
    intent = arguments[0];
    activate = arguments[1];
    slot = arguments[2];
    var parent = this.patcher.parentpatcher;
    if (parent != null) {
        parent.apply(findBPatchers);
    }
    updateSlots = "";
    bpatchers = [];
    intent = "";
}

function findBPatchers(obj) {
    if (obj.maxclass == "patcher") {
        if (obj.varname.toLowerCase().indexOf(intent.toLowerCase()) != -1) {
            // Now set all given slots from menu item selection to inactive
            setActive(obj, activate);
        }
    }
}

function setActive(obj, b) {
    // Set audioplayers of bpatcher active/inactive
    var stateHandler = obj.subpatcher().getnamed("stateHandler");
    var dict = new Dict();
    dict.set(slot, b);
    stateHandler.message("updateState", dict);
}


function log(tag, type, message) {
    post("\n", tag, " || ", type, " || ", message, "\n")
}