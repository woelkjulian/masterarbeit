var colours = new Dict('ui_colours');

function loadbang() {
	comswitch = this.patcher.getnamed('commenterSwitch')

	comswitch.message('activebgoncolor', colours.get('commenterGreen'))
	comswitch.message('activebgcolor', colours.get('buttonGray'))
}
