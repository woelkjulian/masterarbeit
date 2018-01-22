inlets = 1
outlets = 1

function bang() {
    var patcherType = this.patcher.name
    var panelType = this.patcher.parentpatcher.name
    if (patcherType.toLowerCase() == "cui.audio.send") {
        if (panelType.toLowerCase() == "cui.testerpanel") {
            outlet(0, 7470)
        } else if (panelType.toLowerCase() == "cui.simulationpanel") {
            outlet(0, 7474)
        }
    } else if (patcherType.toLowerCase() == "cui.audio.receive") {
        if (panelType.toLowerCase() == "cui.testerpanel") {
            outlet(0, 7474)
        } else if (panelType.toLowerCase() == "cui.simulationpanel") {
            outlet(0, 7470)
        }
    } else if (patcherType.toLowerCase() == "cui.log.send") {
        outlet(0, 7400)
    } else if (patcherType.toLowerCase() == "cui.log.receive") {
        outlet(0, 7400)
    }
}

function log(tag, type, message) {
    post("\n", tag, " || ", type, " || ", message, "\n")
}