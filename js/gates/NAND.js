class NAND {

    constructor(index) {

        this.name = "NAND";
        this.index = index;

        this.x = 10;
        this.y = 10;
        this.startMovementX = undefined;
        this.startMovementY = undefined;

        this.moving = false;

        this.element = $(`
        <div class="ALU-Component NAND" data-gate="NAND" style="top: 10px; left: 10px;" data-index="${index}">
            <div class="component-inner">
                <div class="inDots">
                    <div class="in1 dot mb-1" data-in="1" data-type="in1"></div>
                    <div class="in2 dot" data-in="2" data-type="in2"></div>
                </div>
                <div class="component-image">
                    <img src="./images/nand.png" alt="">
                </div>
                <div class="outDots">
                    <div class="out1 dot" data-out="2" data-type="out1"></div>
                </div>
            </div>
        </div>`);

        board.element.append(this.element);


        const in1DotElement = this.element.find(".in1").eq(0);
        const in2DotElement = this.element.find(".in2").eq(0);
        const out1DotElement = this.element.find(".out1").eq(0);
        this.dots = {
            "in1": new Dot("in1", true, in1DotElement, this),
            "in2": new Dot("in2", true, in2DotElement, this),
            "out1": new Dot("out1", false, out1DotElement, this)
        }


    }

}
