inlets = 1
outlets = 3

setoutletassist(0, "(symbol) 'output colour by key'");
setoutletassist(1, "(symbol) 'output colour for audio routing switch'");
setoutletassist(2, "(symbol) 'output colour commenter switch'");

// DEBUG FLAG
var doDebug = 0;

var dict = new Dict('ui_colours')

function bang() {
	postState('bang')
}

function setDebug(b) {
    doDebug = b;
}

function getcolour(key) {
	outlet(0, dict.get(key))
}

//
//		use case specific colour evaluation
//

function commenterSwitchColour(index) {
	if (index == 0) {
		commenterInactiveColour()
	} else {
		commenterActiveColour()
	}
}

function audioRoutingColour(index) {
	if (index == 0) {
		roomColour()
	} else {
		cueColour()
	}
}

//
//		internal colour fetching and reporting
//

function commenterActiveColour(index) {
	outlet(2, dict.get('commenterGreen'))
}

function commenterInactiveColour(index) {
	outlet(2, dict.get('buttonGray'))
}

function cueColour() {
	outlet(1, dict.get('primaryOrange'))
}

function roomColour() {
	outlet(1, dict.get('primaryYellow'))
}

//
//		logging
//

function postState(context) {
    if (doDebug == 0) {
        return
    }

		post("*** ", context, " BEGIN \n")
		post('number of colours', dict.getkeys().length, '\n')
		var colourNames = dict.getkeys()
		post('known colours : ')
		for (var index in colourNames) {
			post(colourNames[index])
		}
		post('\n')
		post("*** ", context, " END \n")
	}
