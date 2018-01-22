inlets = 1

var origin = { x: 0, y: 0 }
var player = { width: 300, height: 80 }
var audioRouter = { width: 140, height: player.height }
var commenter = { width: 100, height: player.height }
var window = { width: this.patcher.wind.size[0], height: this.patcher.wind.size[1] }
var panel = { width: window.width, height: player.height }
var tag = "cui.generate.topbar.js"
var colourDict = new Dict("ui_colours")

function generate(scenario) {
    var position = { x: origin.x, y: origin.y }
    for (var i in scenario.intents) {
        for (var j in scenario.intents[i].responses) {
            if (scenario.intents[i].name.indexOf("help") != -1) {
                position.x = generatePlayer(scenario, scenario.intents[i], scenario.intents[i].responses[j], "help", position.x, position.y)
            } else if (scenario.intents[i].name.indexOf("error") != -1) {
                position.x = generatePlayer(scenario, scenario.intents[i], scenario.intents[i].responses[j], "error", position.x, position.y)
            }
        }
    }

    this.patcher.newdefault(0, 0, "panel",
        "@patching_rect", position.x, position.y, audioRouter.width, audioRouter.height,
        "@background", 1,
        "@bgfillcolor", colourDict.get("backGray"),
        "@textcolor", 0, 0, 0, 1.0)

    this.patcher.newdefault(0, 0, "bpatcher",
        "@name", "cui.control.audioRouter",
        "@patching_rect", position.x, position.y, audioRouter.width, player.height)

    position.x += audioRouter.width

    this.patcher.newdefault(0, 0, "panel",
        "@patching_rect", position.x, position.y, commenter.width, commenter.height,
        "@background", 1,
        "@bgfillcolor", colourDict.get("backGray"),
        "@textcolor", 0, 0, 0, 1.0)

    this.patcher.newdefault(0, 0, "bpatcher",
        "@name", "cui.control.commenter",
        "@patching_rect", position.x, position.y, commenter.width, commenter.height)

    position.x += commenter.width

    // var panel = this.patcher.newdefault(0, 0, "panel",
    //     "@patching_rect", origin.x, origin.y, position.x - origin.x, player.height,
    //     "@background", 1,
    //     "@bgfillcolor", 0.15, 0.15, 0.15, 0.4)

    // this.patcher.sendtoback(panel)
}

function generatePlayer(scenario, intent, response, type, xPos, yPos) {

    if (type === "help") {
        this.patcher.newdefault(0, 0, "panel",
                "@patching_rect", xPos, yPos, player.width, player.height,
                "@background", 1,
                "@bgfillcolor", colourDict.get("backYellow")),
            "@textcolor", 0, 0, 0, 1.0

    } else if (type === "error") {
        this.patcher.newdefault(0, 0, "panel",
                "@patching_rect", xPos, yPos, player.width, player.height,
                "@background", 1,
                "@bgfillcolor", colourDict.get("backOrange")),
            "@textcolor", 0, 0, 0, 1.0
    }

    var phrase = response.phrase.split(" ").join("_")

    this.patcher.newdefault(0, 0, "bpatcher",
        "@name", "cui.audio.player",
        "@patching_rect", xPos, yPos, player.width, player.height,
        "@args", response.subject, phrase, response.audio, scenario.name + "_" + intent.name)

    return xPos + player.width
}

function log(tag, type, message) {
    post("\n", tag, " || ", type, " || ", message, "\n")
}