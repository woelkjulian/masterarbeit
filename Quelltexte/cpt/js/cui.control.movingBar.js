inlets = 1;

function printScrollInfo() {

    // post("\nlocation: " + this.patcher.wind.location);
    post("\norigin: ")
    post("\nX:" + this.patcher.scrollorigin[0])
    post("\nY:" + this.patcher.scrollorigin[1])
    post("\n");
    post("\noffset: ")
    post("\nX:" + this.patcher.scrolloffset[0])
    post("\nY:" + this.patcher.scrolloffset[1])
    post("\n\n");
}


function scroll(x, y) {
    this.patcher.wind.scrollto(x, y);
}