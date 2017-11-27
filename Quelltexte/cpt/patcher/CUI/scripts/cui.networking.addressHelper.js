inlets = 1
outlets = 3

var names = new Array()
var baseAddress = ''
var fetcher
var menu
var ipDisplay
var addressPart = -1


function loadbang() {
	fetcher = this.patcher.getnamed('netInfoFetcher')
	menu = this.patcher.getnamed('netSelectMenu')
	ipDisplay = this.patcher.getnamed('ipDisplay')
	menu.message('clear')
	menu.ignoreclick = 1
	ipDisplay.message('set', '')
	retrieveInterfaces()
}

function bang() {
	fetcher = this.patcher.getnamed('netInfoFetcher')
	menu = this.patcher.getnamed('netSelectMenu')
	menu.message('clear')
	menu.ignoreclick = 1
	retrieveInterfaces()
}

function retrieve() {
	retrieveAddresses()
}

function retrieveForInterface(name) {
	retrieveAddress(name)
}

function proceed() {
	if (names.length < 1) {
		return
	}

	outputToMenu()
	retrieveAddress(names[0])
}

function completeAddress(number) {
	addressPart = number
	handleAddress()
}

//
//		output info
//


function iocount() {
	outlet(2, names.length)
}

function interfaces() {
	outlet(2, names)
}

function outputToMenu() {
	count = names.length
	for (var index in names) {
		menu.message('append', names[index])
	}

	if (count == 1) {
		menu.ignoreclick = 1
	} else {
		menu.ignoreclick = 0
	}
}

//
//		post information
//

function info() {
	if (names.length > 0) {
		post('******************', '\n')
		for (var index in names) {
			post(names[index], '\n')
		}
		post('******************', '\n')
	}
}

//
//		calls to net.local
//

function retrieveInterfaces() {
	fetcher.message('bang')
}

function retrieveAddresses() {
	for (var index in names) {
			fetcher.message(names[index])
	}
}

function retrieveAddress(specific) {
	for (var index in names) {
			if (names[index] == specific) {
					fetcher.message(names[index])
			}
	}
}

//
//		responses from net.local
//

function netio(name) {
	if (name.indexOf('en') === 0) {
		names.push(name)
	}
}

function ip(address) {
	parts = address.split('.')
	baseAddress = parts[0] + '.' + parts[1] + '.' + parts[2] + '.'

	if (addressPart >= 0) {
		handleAddress()
	} else {
		post('display interesting part \n')
		ipDisplay.message('set', 'send to: ' + parts[3])
	}

	outlet(1, parts[3])
}

//
//		internal helper
//

function handleAddress() {
	fulladdress = baseAddress + addressPart
	ipDisplay.message('set', 'ip: ' + fulladdress)
	outlet(0, fulladdress)
}
