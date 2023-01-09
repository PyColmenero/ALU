class Board {

    constructor() {

        this.element = $("#board");
        this.elementBbox = this.element[0].getBoundingClientRect();
        this.x = this.elementBbox.x;
        this.y = this.elementBbox.y;

        this.bulbs = [];
        this.gates = [];
        this.wires = [];

        this.COMPONENTS_TURN = false;
        this.WIRES_TURN = true;

        this.bulbs_option_buttons = $(".bulbs-option-button");
        this.bulbs_option_buttons.click(this.onBulbOptionButton)

        this.input_bulbs_length = 2;
        this.input_bulbs_line = $("#input-bulbs-line");
        this.output_bulbs_length = 1;
        this.output_bulbs_line = $("#output-bulbs-line");

        this.updateBulbsLength();


    }

    onBulbOptionButton() {

        const button = $(this);
        const type = button.data("type");

        switch (type) {
            case "less-input":
                if (board.input_bulbs_length > 2) {
                    board.input_bulbs_length--;
                }
                break;
            case "plus-input":
                if (board.input_bulbs_length < 10) {
                    board.input_bulbs_length++;
                }
                break;
            case "less-output":
                if (board.output_bulbs_length > 1) {
                    board.output_bulbs_length--;
                }
                break;
            case "plus-output":
                if (board.output_bulbs_length < 10) {
                    board.output_bulbs_length++;
                }
                break;
            default:
                break;
        }

        board.updateBulbsLength();

    }

    updateBulbsLength() {

        // inicializo las bulbs
        this.bulbs = [];


        // INPUTs
        this.input_bulbs_line.html("");
        let input_top_increase = 100 / (this.input_bulbs_length + 1);
        let input_top = input_top_increase;
        for (let index = 0; index < this.input_bulbs_length; index++) {
            // update html
            const currentBulb = $(
                `<div 
                    class="bulb input-bulb"
                    data-click="INPUT-BULB"
                    data-index="${this.bulbs.length}"
                    style="top:${input_top}%;"
                >
                </div>`
            );
            this.input_bulbs_line.append(currentBulb);
            input_top += input_top_increase;

            // add BULB to list
            this.bulbs.push(
                new BULB(this.bulbs.length, true, currentBulb)
            )
        }


        // OUTPUTs
        this.output_bulbs_line.html("");
        let output_top_increase = 100 / (this.output_bulbs_length + 1);
        let output_top = output_top_increase;
        for (let index = 0; index < this.output_bulbs_length; index++) {
            // update html
            const currentBulb = $(
                `<div 
                    class="bulb output-bulb"
                    data-click="OUTPUT-BULB"
                    data-index="${this.bulbs.length}"
                    style="top:${output_top}%;"
                >
                </div>`
            );
            this.output_bulbs_line.append(currentBulb);
            output_top += output_top_increase;

            // add BULB to list
            this.bulbs.push(
                new BULB(this.bulbs.length, false, currentBulb)
            )
        }


    }

    add(component) {
        switch (component) {
            case "AND":
                this.gates.push(
                    new AND(this.gates.length)
                );
                break;
            case "OR":
                this.gates.push(
                    new OR(this.gates.length)
                );
                break;
            case "NOT":
                this.gates.push(
                    new NOT(this.gates.length)
                );
                break;
            default:
                break;
        }
    }

    addWire(componentStart, componentTarget) {
        const wire = new WIRE(this.wires.length, componentStart, componentTarget);
        this.wires.push(
            wire
        );
        return wire;
    }
    removeWire(index) {

        const wire = board.wires[index];
        wire.dotStart.wire = undefined;

        if (wire.componentStart.name !== "BULB") {
            wire.dotStart.unglow();
        }
        wire.dotTarget.wire = undefined;
        if (wire.componentTarget.name !== "BULB") {
            wire.dotTarget.unglow();
        }

        const wireElement = wire.element[0];
        wireElement.remove();

        this.wires.splice(index, 1);

        for (let index = 0; index < this.wires.length; index++) {
            const wire = this.wires[index];

            wire.index = index;
            wire.element.attr("data-index", index);
        }

        this.reload();

    }

    getDotByElement(dotElement) {
        const gateElement = dotElement.parentElement.parentElement.parentElement.parentElement;
        const gateIndex = parseInt(gateElement.dataset.index);
        const gate = board.gates[gateIndex];

        const dotType = dotElement.parentElement.dataset.type;
        return gate.dots[dotType];
    }
    getGateByImageElement(imageElement) {
        const gateElement = imageElement.parentElement.parentElement.parentElement;
        const index = gateElement.dataset.index;
        if (!index) return;
        const component = board.gates[index];
        return component;
    }
    getBulbByElement(bulbElement) {
        const index = bulbElement.dataset.index;
        if (!index) return;
        const bulb = board.bulbs[index];
        return bulb;
    }

    addToNextComponentsToReload(arr, indexs, component) {
        if (indexs.indexOf(component.index) === -1) {
            arr.push(
                component
            );
        }
    }

    reload() {

        for (const bulb of this.bulbs) {
            bulb.transmit();
        }

        for (const gate of this.gates) {

            // si ni un input tiene cable
            const isUnconnectedGate = gate.inputDots.every(d=>!d.wire);

            if(isUnconnectedGate){
                gate.test();
            }

        }

        // let nextComponentsToReload = [];

        // por cada batería...
        // for (const component of this.gates) {

        //     if (component.name === "BULB") {
        //         // si la batería tiene cable
        //         const wire = component.dots.out1.wire;
        //         if (wire) {



        //             // const indexs = nextComponentsToReload.map(x => x.index);
        //             if (wire.componentStart.name === "BULB") {

        //                 wire.indexFrom = wire.componentStart.index;
        //                 // this.addToNextComponentsToReload(nextComponentsToReload, indexs, wire.componentTarget);

        //             } else if (wire.componentTarget.name === "BULB") {

        //                 wire.indexFrom = wire.componentTarget.index;
        //                 // this.addToNextComponentsToReload(nextComponentsToReload, indexs, wire.componentStart);

        //             }

        //             wire.glow();

        //         }
        //     } else if (component.name === "NOT") {

        //         if (!component.dots.in1.glowed) {
        //             component.dots.out1.glow();
        //             if (component.dots.out1.wire) {
        //                 component.dots.out1.wire.glow();
        //             }
        //         }

        //     }

        // }

        // let i = 0;
        // let max = 5;
        // let wiresOrComponetsTurn = this.COMPONENTS_TURN;
        // while (nextComponentsToReload.length !== 0) {

        //     // i++;
        //     // if(i === max){
        //     //     console.log("break");
        //     //     break
        //     // }

        //     let newNextComponentsToReload = [];

        //     for (const component of nextComponentsToReload) {

        //         // si es un componente, compruebo cual para hacer la lógica
        //         if (wiresOrComponetsTurn === this.COMPONENTS_TURN) {

        //             let wire = undefined;
        //             if (component.name === "AND") {
        //                 wire = this.testAND(component);
        //             } else if (component.name === "OR") {
        //                 wire = this.testOR(component);
        //             } else if (component.name === "NOT") {
        //                 wire = this.testNOT(component);
        //             }

        //             if (wire) {
        //                 wire.indexFrom = component.index;
        //                 const indexs = newNextComponentsToReload.map(x => x.index);
        //                 this.addToNextComponentsToReload(newNextComponentsToReload, indexs, wire);
        //             }

        //         }

        //         if (wiresOrComponetsTurn === this.WIRES_TURN) {

        //             const wire = component;

        //             const indexs = newNextComponentsToReload.map(x => x.index);

        //             // si el START no el componente de donde vengo
        //             if (wire.componentStart.index !== wire.indexFrom) {
        //                 // compruebo si está activo el componente de donde SÍ VENGO
        //                 if (wire.componentTarget.dots.out1.glowed) {
        //                     wire.glow();
        //                 }
        //                 // añado a la lista el componente de donde NO VENGO
        //                 this.addToNextComponentsToReload(newNextComponentsToReload, indexs, wire.componentStart);
        //             } else {
        //                 if (wire.componentStart.dots.out1.glowed) {
        //                     wire.glow();
        //                 }
        //                 this.addToNextComponentsToReload(newNextComponentsToReload, indexs, wire.componentTarget);
        //             }

        //         }

        //     }

        //     nextComponentsToReload = [...newNextComponentsToReload];

        //     // cambiamos de turno
        //     wiresOrComponetsTurn = !wiresOrComponetsTurn;

        //     console.log(nextComponentsToReload);

        //     // break;

        // }



    }

    testAND(component) {
        const in1 = component.dots.in1;
        if (in1.wire) {
            if (in1.wire.glowed) {
                in1.glow();
            }
        }
        const in2 = component.dots.in2;
        if (in2.wire) {
            if (in2.wire.glowed) {
                in2.glow();
            }
        }

        if (in1.glowed && in2.glowed) {
            component.dots.out1.glow();
        } else {
            component.dots.out1.unglow();
        }

        if (component.dots.out1.wire) {
            return component.dots.out1.wire;
        }

    }
    testOR(component) {
        const in1 = component.dots.in1;
        if (in1.wire) {
            if (in1.wire.glowed) {
                in1.glow();
            }
        }
        const in2 = component.dots.in2;
        if (in2.wire) {
            if (in2.wire.glowed) {
                in2.glow();
            }
        }

        if (in1.glowed || in2.glowed) {
            component.dots.out1.glow();
        } else {
            component.dots.out1.unglow();
        }

        if (component.dots.out1.wire) {
            return component.dots.out1.wire;
        }

    }
    testNOT(component) {
        const in1 = component.dots.in1;
        if (in1.wire) {
            if (in1.wire.glowed) {
                in1.glow();
            }
        }

        if (in1.glowed) {
            component.dots.out1.unglow();
        } else {
            component.dots.out1.glow();
        }

        console.log(component.dots.out1);
        if (component.dots.out1.wire) {
            return component.dots.out1.wire;
        }

    }


}