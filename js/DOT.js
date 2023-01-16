class Dot {
    constructor(name, inout, element, componentParent) {
        this.name = name;
        this.inout = inout;
        this.element = element;
        this.componentParent = componentParent;
        this.wires = [];
        this.glowed = false;
    }
    glow() {
        // console.log("glowed");
        this.glowed = true;
        this.element.addClass("glow");
        if (this.inout) {
            this.componentParent.test();
        }
    }
    unglow() {
        this.glowed = false;
        this.element.removeClass("glow");
        if (this.inout) {
            this.componentParent.test();
        }
    }
    addWire(wire){
        this.wires.push( wire );
    }
}