class BULB {

    constructor(index, type, element) {

        this.name = "BULB";
        this.index = index;
        this.type = type;
        this.element = element;

        this.wire = undefined;

    }

    glow() {
        this.glowed = true;
        this.element.addClass("glow");
        this.transmit();
    }
    unglow() {
        this.glowed = false;
        this.element.removeClass("glow");
        this.transmit();
    }
    switch() {
        if (this.glowed) {
            this.unglow();
        } else {
            this.glow();
        }
    }
    addWire(wire) {
        this.wire = wire;
    }
    transmit() {
        if (this.wire) {
            if (this.glowed) {

                this.wire.glow();

            } else {

                this.wire.unglow();

            }
        }
    }

}