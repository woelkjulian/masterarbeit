inlets = 1

function bang() {
	player = this.patcher.getnamed('playerOne')
	statehandler = player.subpatcher().getnamed('stateHandler')

	slotsToSet = new Array()
	slotsToSet.push('Betrag')
	slotsToSet.push('Name')

	statehandler.message('setDebug', 1)
	statehandler.message('init', slotsToSet)
	statehandler.message('setDebug', 0)
}

function resolvedName() {
	player = this.patcher.getnamed('playerOne')
	statehandler = player.subpatcher().getnamed('stateHandler')

	var dict = new Dict();
	dict.set('Name', 1);

	statehandler.message('setDebug', 1)
	statehandler.message('updateState', dict)
	statehandler.message('setDebug', 0)
}

function handleName() {
	player = this.patcher.getnamed('playerOne')
	statehandler = player.subpatcher().getnamed('stateHandler')

	var dict = new Dict();
	dict.set('Name', 0);

	statehandler.message('setDebug', 1)
	statehandler.message('updateState', dict)
	statehandler.message('setDebug', 0)
}

function resolvedAmount() {
	player = this.patcher.getnamed('playerOne')
	statehandler = player.subpatcher().getnamed('stateHandler')

	var dict = new Dict();
	dict.set('Betrag', 1);

	statehandler.message('setDebug', 1)
	statehandler.message('updateState', dict)
	statehandler.message('setDebug', 0)
}

function handleAmount() {
	player = this.patcher.getnamed('playerOne')
	statehandler = player.subpatcher().getnamed('stateHandler')

	var dict = new Dict();
	dict.set('Betrag', 0);

	statehandler.message('setDebug', 1)
	statehandler.message('updateState', dict)
	statehandler.message('setDebug', 0)
}

function resolvedIrrelevant() {
	player = this.patcher.getnamed('playerOne')
	statehandler = player.subpatcher().getnamed('stateHandler')

	var dict = new Dict();
	dict.set('Intervall', 1);

	statehandler.message('setDebug', 1)
	statehandler.message('updateState', dict)
	statehandler.message('setDebug', 0)
}

function handleIrrelevant() {
	player = this.patcher.getnamed('playerOne')
	statehandler = player.subpatcher().getnamed('stateHandler')

	var dict = new Dict();
	dict.set('Intervall', 0);

	statehandler.message('setDebug', 1)
	statehandler.message('updateState', dict)
	statehandler.message('setDebug', 0)
}

function resolvedTuple() {
	player = this.patcher.getnamed('playerOne')
	statehandler = player.subpatcher().getnamed('stateHandler')

	var dict = new Dict();
	dict.set('Name', 1);
	dict.set('Betrag', 1);

	statehandler.message('setDebug', 1)
	statehandler.message('updateState', dict)
	statehandler.message('setDebug', 0)
}

function handleTuple() {
	player = this.patcher.getnamed('playerOne')
	statehandler = player.subpatcher().getnamed('stateHandler')

	var dict = new Dict();
	dict.set('Name', 0);
	dict.set('Betrag', 0);

	statehandler.message('setDebug', 1)
	statehandler.message('updateState', dict)
	statehandler.message('setDebug', 0)
}
