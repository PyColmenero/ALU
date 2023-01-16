class BULB {

    constructor(index, type, element) {

        this.name = "BULB";
        this.index = index;
        this.type = type;
        this.element = element;

        this.wires = [];

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
        this.wires.push(wire);
    }
    transmit() {

        for (const wire of this.wires) {

            if (this.glowed) {

                wire.glow();

            } else {

                wire.unglow();

            }

        }

    }

}