class Board {

    constructor() {

        this.element = $("#board");
        this.board_toolspanel = $("#board-toolspanel");
        this.elementBbox = this.element[0].getBoundingClientRect();
        this.x = this.elementBbox.x;
        this.y = this.elementBbox.y;

        this.inputs = [];
        this.outputs = [];
        this.gates = [];
        this.wires = [];

        // this.COMPONENTS_TURN = false;
        // this.WIRES_TURN = true;

        this.bulbs_option_buttons = $(".bulbs-option-button");
        this.bulbs_option_buttons.click(this.onBulbOptionButton)

        this.input_bulbs_length = 2;
        this.input_bulbs_line = $("#input-bulbs-line");
        this.output_bulbs_length = 1;
        this.output_bulbs_line = $("#output-bulbs-line");

        this.saved_components = {}

        this.updateBulbsLength();
        this.loadSavedComponents();
        this.handleToolComponentClicks();

    }
    handleToolComponentClicks() {
        this.componentToolButtons = $(".ALU-Component-tool");

        this.componentToolButtons.click(function () {
            const clickedComponent = $(this).data("gate");
            board.add(clickedComponent);
        });
    }

    loadSavedComponents() {

        this.components_index = JSON.parse(
            localStorage.getItem("components")
        );

        for (const component of this.components_index) {
            const component_object = JSON.parse(
                localStorage.getItem(component)
            )

            const component_element = $(` <div class="ALU-Component-tool notcustom ${component}" data-gate="${component}" id="${component}">
                <div class="component-inner">
                    <div class="component-image">
                        <div class="ALU-Component-border">
                            <div class="ALU-Component-bg" data-click="COMPONENT">
                                <p class="m-0 fw-bold" data-click="COMPONENT">${component}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`);
            this.board_toolspanel.append(
                component_element
            );

            this.saved_components[component] = component_object;
        }

    }

    onBulbOptionButton() {

        const button = $(this);
        const type = button.data("type");

        switch (type) {
            case "less-input":
                if (board.input_bulbs_length > 1) {
                    board.input_bulbs_length--;
                }
                break;
            case "plus-input":
                if (board.input_bulbs_length < 16) {
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
        this.inputs = [];
        this.outputs = [];


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
                    data-index="${this.inputs.length}"
                    style="top:${input_top}%;"
                >
                </div>`
            );
            this.input_bulbs_line.append(currentBulb);
            input_top += input_top_increase;

            // add BULB to list
            this.inputs.push(
                new BULB(this.inputs.length, true, currentBulb)
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
                    data-index="${this.outputs.length}"
                    style="top:${output_top}%;"
                >
                </div>`
            );
            this.output_bulbs_line.append(currentBulb);
            output_top += output_top_increase;

            // add BULB to list
            this.outputs.push(
                new BULB(this.outputs.length, false, currentBulb)
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
                this.gates.push(
                    new WILDCART(component, this.gates.length, this.saved_components[component])
                );
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
    removeGate(elementImage) {

        const gate = this.getGateByImageElement(elementImage);

        for (const key in gate.dots) {
            if (Object.hasOwnProperty.call(gate.dots, key)) {
                const dot = gate.dots[key];
                for (const wire of dot.wires) {
                    this.removeWire(wire.index);
                }

            }
        }

        delete gate.element.remove();
        this.gates.splice(gate.index, 1);

        for (let index = 0; index < this.gates.length; index++) {
            const gate = this.gates[index];

            gate.index = index;
            gate.element.attr("data-index", index);
        }

        this.reload();
    }
    removeWireFromDot(dot, wire) {
        dot.wires = dot.wires.filter(w => w.index !== wire.index)
    }
    removeWire(index) {

        const wire = board.wires[index];

        // quitar a los dots a los que estoy unidos
        // mi referencia entre los wires a los que dice estar unirse
        if (wire.dotTarget) {
            wire.dotTarget.unglow();
            this.removeWireFromDot(wire.dotStart, wire);
        }
        if (wire.dotTarget) {
            wire.dotTarget.unglow();
            this.removeWireFromDot(wire.dotTarget, wire);
        }

        // quitar el elemento del DOM
        const wireElement = wire.element[0];
        wireElement.remove();

        // quitarlo de la lista de wires
        this.wires.splice(index, 1);

        // reasignar los indexes
        for (let index = 0; index < this.wires.length; index++) {
            const wire = this.wires[index];

            wire.index = index;
            wire.element.attr("data-index", index);
        }

        // recargar el circuito
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

        const tagName = imageElement.tagName;
        let gateElement = undefined;

        if (tagName === "P") {
            gateElement = imageElement.parentElement.parentElement.parentElement.parentElement.parentElement;
        }
        if (tagName === "DIV") {
            gateElement = imageElement.parentElement.parentElement.parentElement.parentElement;
        }

        const index = gateElement.dataset.index;
        if (!index) return;
        const component = board.gates[index];
        return component;
    }
    getWireFromTextureElement(elementTexture) {
        const wireElement = elementTexture.parentElement.parentElement.parentElement;
        const index = wireElement.dataset.index;
        if (!index) return;
        const wire = board.wires[index];
        return wire;
    }
    getBulbByElement(bulbElement) {
        const index = bulbElement.dataset.index;
        const inout = bulbElement.dataset.click;
        if (!index) return;
        if (inout === "INPUT-BULB") {
            return board.inputs[index];
        } else {
            return board.outputs[index];
        }
    }

    addToNextComponentsToReload(arr, indexs, component) {
        if (indexs.indexOf(component.index) === -1) {
            arr.push(
                component
            );
        }
    }

    reload() {


        for (const bulb of this.inputs) {
            bulb.transmit();
        }

        for (const gate of this.gates) {

            // si ni un input tiene cable
            const isUnconnectedGate = gate.inputDots.every(d => !d.wire);

            if (isUnconnectedGate) {
                gate.test();
            }

        }

    }


    save(name) {

        let newGate = {
            "inputs": [],
            "outputs": [],
            "components": []
        }

        for (const bulb of this.inputs) {
            let input = { "connections": [] };

            for (const wire of bulb.wires) {
                console.log(wire.dotTarget);
                // si va del input al output directamente
                if (wire.dotTarget.name === "BULB") {
                    input.connections.push(
                        {
                            "bulbindex": wire.dotTarget.index
                        }
                    );
                } else {
                    input.connections.push(
                        {
                            "componentindex": wire.dotTarget.componentParent.index,
                            "dotindex": wire.dotTarget.name
                        }
                    )
                }
            }

            newGate.inputs.push(input);
        }
        for (const _ of this.outputs) {
            newGate.outputs.push(false);
        }

        for (const gate of this.gates) {

            let component = { "type": gate.name, "connections": {  } };

            if (["AND", "OR"].includes(gate.name)) {
                component.inputs = [false, false];
                component.outputs = [false];
            } else if ("NOT" == gate.name) {
                component.inputs = [false];
                component.outputs = [false];
            } else {
                component.inputs = gate.inputDots.map(_ => false);
                component.outputs = gate.outputDots.map(_ => false);
            }

            for (const dot of gate.outputDots) {
                
                component.connections[dot.name] = [];

                for (const wire of dot.wires) {
                    let connection = undefined;
                    if (wire.dotTarget.name === "BULB") {
                        connection = {
                            "bulbindex": wire.dotTarget.index
                        }
                    } else {
                        connection = {
                            "componentindex": wire.dotTarget.componentParent.index,
                            "dotindex": wire.dotTarget.name
                        }
                    }

                    component.connections[dot.name].push(connection);
                }

            }

            newGate.components.push(component);

        }


        // add current new component to components index
        let componentsIndex = JSON.parse(
            localStorage.getItem("components")
        );
        componentsIndex.push(name);
        localStorage.setItem("components", JSON.stringify(componentsIndex));

        // save new component
        localStorage.setItem(name, JSON.stringify(newGate))


    }



}