inlets = 1

// DEBUG FLAG
var doDebug = 0;

var slots = new Dict()

function setDebug(b) {
    doDebug = b;
}

function init() {
    for (var index in arguments) {
        if (arguments[index] instanceof Array) {
            for (var i in arguments[index]) {
                slots.set(arguments[index][i], 0)
            }
        } else {
            slots.set(arguments[index], 0)
        }
    }

    outputState("INIT COMPLETED")
}

function updateState(dict) {
    outputState("UPDATE STATE BEFORE")

    //
    //		Update
    //
    needsToCheck = updateSlotStates(dict)

    ///
    ///		Evaluate new slot states
    ///
    if (needsToCheck) {
        evaluateSlotStates()
    }

    outputState("UPDATE STATE AFTER")
}

function canProcess(slotType) {
    if ((slotType instanceof String) && slots.getkeys().length > 0) {
        if (slots.contains(slotType) == 1) {
          return true
        }
    }

    return false
}

///
///		State handling functions - should be & get used internally
///

function isResolved() {
    checkIndicator = this.patcher.getnamed('checkIndicator')
    destinationSwitch = this.patcher.getnamed('destinationSwitch')
    triggerArea = this.patcher.getnamed('triggerArea')
    ppm = this.patcher.getnamed('signal_ppm')

    checkIndicator.hidden = 0
    destinationSwitch.hidden = 1
    triggerArea.ignoreclick = 1
    ppm.hidden = 1
}

function doHandle() {
    checkIndicator = this.patcher.getnamed('checkIndicator')
    destinationSwitch = this.patcher.getnamed('destinationSwitch')
    triggerArea = this.patcher.getnamed('triggerArea')
    ppm = this.patcher.getnamed('signal_ppm')

    checkIndicator.hidden = 1
    destinationSwitch.hidden = 0
    triggerArea.ignoreclick = 0
    ppm.hidden = 0
}

///
///		Internal messages
///

function outputState(context) {
    if (doDebug == 0) {
        return
    }
    post("*** ", context, " BEGIN \n")
    var keys = slots.getkeys()

    if (keys instanceof Array) {
        for (var index in keys) {
            post(keys[index])
            post(slots.get(keys[index]), "\n")
        }
    } else {
        post(keys);
        post(slots.get(keys), "\n")
    }
    post("*** ", context, " END \n")
}

function evaluateSlotStates() {
    values = new Array()
    keys = slots.getkeys()

    if (keys instanceof Array) {
        for (var index in keys) {
            values.push(slots.get(keys[index]))
        }
    } else {
        didChange = true
        values.push(slots.get(keys))
    }


    if (contains(values, 1)) {
        if (doDebug != 0) {
            post("is resolved \n")
        }
        isResolved()
    } else {
        if (doDebug != 0) {
            post("do handle \n")
        }
        doHandle()
    }
}

function updateSlotStates(dict) {
    keys = (dict.getkeys())

    if (keys instanceof Array) {
        return updateSlotStatesWithDictionary(dict)
    } else {
        return updateSlotStatesWithString(dict)
    }
}

function updateSlotStatesWithDictionary(dict) {
    keys = (dict.getkeys())
    relevantKeys = slots.getkeys()
    didChange = false

    if (relevantKeys instanceof Array) {
        for (var index in keys) {
            key = keys[index]
            if (slots.contains(key) == 1) {
                didChange = checkAndChangeSlot(key, dict)
            }
        }
    } else {
        for (var index in keys) {
            key = keys[index]
            if (key == relevantKeys) {
                didChange = checkAndChangeSlot(key, dict)
            }
        }
    }

    return didChange
}

function updateSlotStatesWithString(dict) {
    key = (dict.getkeys())
    relevantKeys = slots.getkeys()
    didChange = false

    if (relevantKeys instanceof Array) {
        if (slots.contains(key) == 1) {
            didChange = checkAndChangeSlot(key, dict)
        }
    } else {
        if (relevantKeys == key) {
            didChange = checkAndChangeSlot(key, dict)
        }
    }

    return didChange
}

function checkAndChangeSlot(key, dict) {
    if (slots.get(key) != dict.get(key)) {
        slots.set(key, dict.get(key))
        return true
    }

    return false
}

function contains(values, target) {
    for (var index in values) {
        if (values[index] == target) {
            return true
        }
    }

    return false
}