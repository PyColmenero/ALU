class WILDCART {

    constructor(name, index, component) {

        this.name = name;
        this.index = index;

        this.x = 30;
        this.y = 30;
        this.startMovementX = undefined;
        this.startMovementY = undefined;

        this.component = component;
        const inputsLength = component.inputs.length;
        const inputDotHeight = 100 / inputsLength;
        const outputsLength = component.outputs.length;
        const outputDotHeight = 100 / outputsLength;
        
        const height = 10 + (12 * Math.max(inputsLength, outputsLength));

        const input_dots_html = component.inputs.map((_, i) => {
            return `<div class="dot d-flex align-items-center in${i + 1}" data-type="in${i + 1}" style="height:${inputDotHeight}%">
                <div class="dot-texture" data-click="INPUT-DOT"></div>
            </div>`
        }).join("");
        const output_dots_html = component.outputs.map((_, i) => {
            return `<div class="dot d-flex align-items-center out${i + 1}" data-type="out${i + 1}" style="height:${outputDotHeight}%">
                <div class="dot-texture" data-click="OUTPUT-DOT"></div>
            </div>`
        }).join("");

        this.element = $(
            `<div class="ALU-Component custom ${this.name}" data-gate="${this.name}" style="top: 30px; left: 30px;" data-index="${index}">
            <div class="component-inner">
                <div class="inDots h-100">
                    ${input_dots_html}
                </div>
                <div class="component-image">
                    <div class="ALU-Component-border" style="height: ${height}px;">
                        <div class="ALU-Component-bg" data-click="COMPONENT">
                            <p class="m-0 fw-bold" data-click="COMPONENT">${this.name}</p>
                        </div>
                    </div>
                </div>
                <div class="outDots h-100">
                    ${output_dots_html}
                </div>
            </div>
        </div>`);


        board.element.append(this.element);

        this.dots = {};
        this.inputDots = [];
        this.outputDots = [];

        for (let index = 0; index < component.inputs.length; index++) {
            const name = "in" + (index + 1);
            const currentDotElement = this.element.find("." + name).eq(0);
            const currentDot = new Dot(name, true, currentDotElement, this);
            this.dots[name] = currentDot;
            this.inputDots.push(currentDot);
            // currentDot.glow();
        }
        for (let index = 0; index < component.outputs.length; index++) {
            const name = "out" + (index + 1);
            const currentDotElement = this.element.find("." + name).eq(0);
            const currentDot = new Dot(name, false, currentDotElement, this);
            this.dots[name] = currentDot;
            this.outputDots.push(currentDot);
        }


        // const in2DotElement = this.element.find(".in2").eq(0);
        // const out1DotElement = this.element.find(".out1").eq(0);
        // this.dots = {
        //     "in1": new Dot("in1", true, in1DotElement, this),
        //     "in2": new Dot("in2", true, in2DotElement, this),
        //     "out1": new Dot("out1", false, out1DotElement, this)
        // }

        // console.log(this.element);

        this.test();

    }

    test() {

        console.log("");
        console.log("");

        const inputs = this.inputDots.map(i => i.glowed);

        this.getTestedComponent(this.component, inputs);

        console.log(this.component.outputs);

        for (let index = 0; index < this.outputDots.length; index++) {
            const outputDot = this.outputDots[index];
            if (this.component.outputs[index] === true) {
                outputDot.glow();
                for (const wire of outputDot.wires) {
                    wire.glow();
                }
            } else {
                outputDot.unglow();
                for (const wire of outputDot.wires) {
                    wire.unglow();
                }
            }
        }

    }

    getTestedComponent(component, inputs) {
        for (let index = 0; index < inputs.length; index++) {
            const glowed = inputs[index];
            const inputDots = component.inputs[index];
            for (const conn of inputDots.connections) {
                this.currentTest(component, conn, glowed);
            }
        }
        return component;
    }

    testGate(gate) {
        switch (gate.type) {
            case "AND":
                gate.outputs[0] = gate.inputs[0] === true && gate.inputs[1] === true;
                break;
            case "OR":
                gate.outputs[0] = gate.inputs[0] === true || gate.inputs[1] === true;
                break;
            case "NOT":
                gate.outputs[0] = !gate.inputs[0];
                break;
            default:

                let componentToTest = JSON.parse(
                    JSON.stringify(
                        board.saved_components[gate.type]
                    )
                );
                this.getTestedComponent(componentToTest, gate.inputs);
                // console.log("===");
                // console.log(componentToTest);
                // console.log(gate.inputs);
                // console.log(componentToTest.outputs);
                // console.log(this.component.outputs);
                // console.log("===");
                gate.outputs = componentToTest.outputs;

                break;
        }
    }

    currentTest(component, conn, glowed) {

        if (conn.componentindex !== undefined) {

            const connectedComponent = component.components[
                conn.componentindex
            ];
            const outputConnections = connectedComponent.connections;
            let gate = component.components[conn.componentindex];
            const inputIndex = parseInt(conn.dotindex.slice(-1)[0]) - 1;
            gate.inputs[inputIndex] = glowed;

            this.testGate(gate);

            let outputConnectionsIndex = 0;
            for (const key in outputConnections) {
                if (Object.hasOwnProperty.call(outputConnections, key)) {
                    const connections = outputConnections[key];
                    for (const connection of connections) {
                        this.currentTest(
                            component, connection, gate.outputs[outputConnectionsIndex]
                        );
                    }
                    outputConnectionsIndex++;
                }
            }
        }
        if (conn.bulbindex !== undefined) {
            component.outputs[conn.bulbindex] = glowed;
        }
    }

}