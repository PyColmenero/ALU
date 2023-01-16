class WIRE {

    constructor(index, dotStart, dotTarget) {

        this.index = index;
        this.dotStart = dotStart;
        this.dotTarget = dotTarget;

        this.wirepart = `<div class="wire-pivot">
            <div class="wire-texture" data-click="WIRE"></div>
        </div>`

        // creo el elemento html
        this.element = $(`<div class="wire" data-index="${index}">
            <div class="wireparts position-relative">
                
            </div>
        </div>`);
        // lo añado a la mesa
        board.element.prepend(this.element);

        // me coloco en el centro del objeto por el que empiezo
        const bbox = dotStart.element[0].getBoundingClientRect();
        this.x = (bbox.x - board.x) + ((bbox.width - 8) / 2);
        this.y = (bbox.y - board.y) + ((bbox.height - 8) / 2);
        this.element.css("left", this.x);
        this.element.css("top", this.y);

        this.wireparts = this.element.children().eq(0);
        
        this.addFirstWirepart();    

    }

    addFirstWirepart(){
        this.wireparts.append( this.wirepart );
        this.lastWirepart = this.wireparts.children().last();
        this.lastWirepartTexture = this.lastWirepart.children().eq(0);
        this.lastWirepart.css("top", 0);
        this.lastWirepart.css("left", 0);
        this.lastWirepart.attr("data-dir", "right");
    }

    addDotTarget(dot) {
        this.dotTarget = dot;
    }

    adjustLastWirepart(width, height) {
        const lastWirepartTexture = this.lastWirepartTexture;
        if ( Math.abs(width) > Math.abs(height) || (width !== undefined && height === undefined) ) {
            // console.log("aaa", width);
            lastWirepartTexture.css("width", Math.abs(width));
            if (width > 0) {
                this.lastWirepart.css("transform", "rotate(0deg)");
                this.lastWirepart.attr("data-dir", "right");
            } else {
                this.lastWirepart.css("transform", "rotate(180deg)");
                this.lastWirepart.attr("data-dir", "left");
            }
        } else {
            lastWirepartTexture.css("width", Math.abs(height));
            if (height > 0) {
                this.lastWirepart.css("transform", "rotate(90deg)");
                this.lastWirepart.attr("data-dir", "bottom");
            } else {
                this.lastWirepart.css("transform", "rotate(270deg)");
                this.lastWirepart.attr("data-dir", "top");
            }
        }
    }
    addWirepart() {

        const top = parseFloat(this.lastWirepart.css("top").replaceAll("px", ""));
        const left = parseFloat(this.lastWirepart.css("left").replaceAll("px", ""));
        const dir = this.lastWirepart.data("dir");
        const length = parseFloat(this.lastWirepartTexture.css("width").replaceAll("px", "")) - 8;

        const currentWirepart = $(this.wirepart)
        this.wireparts.append(currentWirepart);
        this.lastWirepart = currentWirepart;
        this.lastWirepartTexture = this.lastWirepart.children().eq(0);

        if (dir === "right") {
            this.lastWirepart.css("left", left + length);
            this.lastWirepart.css("top", top);
        }
        if (dir === "left") {
            this.lastWirepart.css("left", left - length);
            this.lastWirepart.css("top", top);
        }
        if (dir === "top") {
            this.lastWirepart.css("top", top - length);
            this.lastWirepart.css("left", left);
        }
        if (dir === "bottom") {
            this.lastWirepart.css("top", top + length);
            this.lastWirepart.css("left", left);
        }

    }

    glow() {
        this.glowed = true;
        this.element.addClass("glow");

        if (this.dotTarget) {
            this.dotTarget.glow();
        }
    }
    unglow() {
        this.glowed = false;
        this.element.removeClass("glow");

        if (this.dotTarget) {
            this.dotTarget.unglow();
        }
    }

    reCenter() {

        if (!this.dotStart) return;


        const dotStartBbox = this.dotStart.element[0].getBoundingClientRect();
        const dotTargetBbox = this.dotTarget.element[0].getBoundingClientRect();
        const x1 = dotStartBbox.x - board.elementBbox.x;
        const y1 = dotStartBbox.y - board.elementBbox.y;
        const x2 = (dotTargetBbox.x - board.x) - x1;
        const y2 = (dotTargetBbox.y - board.x) - y1;

        this.element.css("left", x1);
        this.element.css("top", y1);


        var a = Math.atan2(x2, y2);
        if (a < 0) a += 2 * Math.PI; //angle is now in radians
        a -= (Math.PI / 2); //shift by 90deg
        if (a < 0) a += 2 * Math.PI;
        if (a < 0) a += 2 * Math.PI;
        a = Math.abs((Math.PI * 2) - a); //invert rotation
        const theta = (a * 180 / Math.PI); //convert to deg
        const hipotenuse = Math.hypot(x2, y2);

        this.element.children().eq(0).css("width", hipotenuse);
        this.element.css("transform", "rotate(" + theta + "deg)");


    }

}