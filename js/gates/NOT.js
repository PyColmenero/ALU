class NOT {

    constructor(index) {

        this.name = "NOT";
        this.index = index;

        this.x = 10;
        this.y = 10;
        this.startMovementX = undefined;
        this.startMovementY = undefined;

        this.moving = false;

        this.element = $(`
        <div class="ALU-Component NOT" data-gate="NOT" style="top: 10px; left: 10px;" data-index="${index}">
            <div class="component-inner">
                <div class="inDots h-100">
                    <div class="dot h-100 d-flex align-items-center in1" data-type="in1">
                        <div class="dot-texture" data-click="INPUT-DOT"></div>
                    </div>
                </div>
                <div class="component-image">
                    <img src="./images/not.png" alt="" data-click="COMPONENT">
                </div>
                <div class="outDots h-100">
                    <div class="dot h-100 d-flex align-items-center out1" data-type="out1">
                        <div class="dot-texture" data-click="OUTPUT-DOT"></div>
                    </div>
                </div>
            </div>
        </div>`);


        board.element.append(this.element);

        const in1DotElement = this.element.find(".in1").eq(0);
        const out1DotElement = this.element.find(".out1").eq(0);
        this.dots = {
            "in1": new Dot("in1", true, in1DotElement, this),
            "out1": new Dot("out1", false, out1DotElement, this)
        }
        this.inputDots = [
            this.dots.in1
        ]

        this.dots.out1.glow();

    }

    test() {
        const in1 = this.dots.in1;

        if (in1.glowed) {
            this.dots.out1.unglow();
            if (this.dots.out1.wire) {
                this.dots.out1.wire.unglow();
            }
        } else {
            this.dots.out1.glow();
            if (this.dots.out1.wire) {
                this.dots.out1.wire.glow();
            }
        }
    }

}