class DragDroper {

    constructor() {

        $("#board-playground").on("mousedown", function (e) {

            e.preventDefault();

            const target = e.target;
            const targetType = target.dataset.click;
            window.startTarget = target;
            window.startTargetType = targetType;


            if (targetType) {
                console.log("START CLICK:", targetType);

                if (window.startTargetType === "COMPONENT") {

                    if (e.which === 1) {
                        const gate = board.getGateByImageElement(target);

                        window.startComponent = gate;

                        gate.startMovementX = e.clientX;
                        gate.startMovementY = e.clientY;

                        gate.element.css("z-index", 999);
                    }

                }
            }
        });

        $("#board-playground").on("mousemove", function (e) {

            if (window.startTargetType === "COMPONENT") {

                if (window.startComponent) {
                    const component = window.startComponent;
                    const diffX = e.clientX - component.startMovementX;
                    const diffY = e.clientY - component.startMovementY;

                    const maxX = Math.floor(board.elementBbox.width / 30) * 26;
                    const maxY = Math.floor(board.elementBbox.height / 30) * 26;

                    const roundTo = 10;
                    const x = Math.min(
                        Math.max(
                            Math.round((diffX + component.x) / roundTo) * roundTo,
                            roundTo
                        ),
                        maxX
                    );
                    const y = Math.min(
                        Math.max(
                            Math.round((diffY + component.y) / roundTo) * roundTo,
                            roundTo
                        ),
                        maxY
                    );

                    component.element.css("left", x);
                    component.element.css("top", y);



                    for (const key in component.dots) {
                        if (Object.hasOwnProperty.call(component.dots, key)) {

                            const dot = component.dots[key];

                            for (const wire of dot.wires) {

                                const dotBbox = dot.element.children()[0].getBoundingClientRect();
                                const wireBbox = wire.element[0].getBoundingClientRect();

                                let width = (dotBbox.x - wireBbox.x) / 2;
                                let height = dotBbox.y - wireBbox.y;

                                if (width < 0) width -= 8;
                                if (width > 0) width += 8;
                                // if (height > 0) height += 14;

                                const wirepartsLength = wire.wireparts.children().length;
                                if(wirepartsLength >= 3){

                                    wire.wireparts.children().last().remove();
                                    wire.wireparts.children().last().remove();
                                    wire.wireparts.children().last().remove();
                                    if(wirepartsLength === 3){
                                        wire.lastWirepart = undefined
                                        wire.addFirstWirepart();
                                    } else {
                                        wire.lastWirepart = wire.wireparts.children().last();
                                    }

                                    wire.adjustLastWirepart(width, undefined);
                                    wire.addWirepart();
                                    wire.adjustLastWirepart(undefined, height);
                                    wire.addWirepart();
                                    wire.adjustLastWirepart(width, undefined);
                                    

                                } 

                            }
                        }
                    }
                }


                // const dots = Object.entries(component.dots);

                // for (const [name, dot] of dots) {

                //     if (dot.wire) {
                //         dot.wire.reCenter();
                //     }

                // }


            }
            if (window.dragdropMODE === "CREATING-WIRE") {

                // if(width > 0 && width < 16){
                //     width = 16
                // }
                const wire = window.currentWire;
                const lastWirepart = wire.lastWirepart;
                const bbox = lastWirepart[0].getBoundingClientRect();
                let width = (e.clientX - bbox.x);
                let height = (e.clientY - bbox.y);

                wire.adjustLastWirepart(width, height);


            }

        });
        $("#board-playground").on("mouseup", function (e) {

            const targetElement = e.target;
            const targetType = targetElement.dataset.click;

            // SI ESTAMOS CREANDO UN WIRE
            if (window.dragdropMODE === "CREATING-WIRE") {

                const wire = window.currentWire;

                if (targetType === "INPUT-DOT") {

                    // he terminado de crear el WIRE
                    const dot = board.getDotByElement(targetElement);

                    const wirepartsLength = wire.wireparts.children().length;
                    if (wirepartsLength === 1) {

                        const dotBbox = dot.element[0].getBoundingClientRect();
                        const wireBbox = wire.element[0].getBoundingClientRect();

                        let width = (dotBbox.x - wireBbox.x) / 2;
                        let height = dotBbox.y - wireBbox.y;

                        if (width < 0) width -= 8;
                        if (width > 0) width += 8;
                        if (height > 0) height += 18;

                        wire.adjustLastWirepart(width, undefined);
                        wire.addWirepart();
                        wire.adjustLastWirepart(undefined, height);
                        wire.addWirepart();
                        wire.adjustLastWirepart(width, undefined);


                    }


                    // si he empezado en desde un BULB
                    if (window.currentDot) {
                        window.currentDot.addWire(wire);
                        wire.addDotTarget(dot);
                    }
                    // si he empezado en desde un DOT
                    if (window.currentBulb) {
                        window.currentBulb.addWire(wire);
                        wire.addDotTarget(dot);
                    }

                    dot.addWire(wire);

                    window.dragdropMODE = undefined;
                    window.currentWire = undefined;
                    window.currentBulb = undefined;
                    window.currentDot = undefined;

                    board.reload();

                } else if (targetType === "OUTPUT-BULB") {

                    // he terminado de crear el WIRE
                    const bulb = board.getBulbByElement(targetElement);

                    const wirepartsLength = wire.wireparts.children().length;
                    if (wirepartsLength === 1) {

                        const dotBbox = bulb.element[0].getBoundingClientRect();
                        const wireBbox = wire.element[0].getBoundingClientRect();

                        let width = (dotBbox.x - wireBbox.x) / 2;
                        let height = dotBbox.y - wireBbox.y;

                        if (width < 0) width -= 8;
                        if (width > 0) width += 8;
                        if (height > 0) height += 18;

                        wire.adjustLastWirepart(width, undefined);
                        wire.addWirepart();
                        wire.adjustLastWirepart(undefined, height);
                        wire.addWirepart();
                        wire.adjustLastWirepart(width, undefined);


                    }

                    // si he empezado en desde un BULB
                    if (window.currentDot) {
                        window.currentDot.addWire(wire);
                        wire.addDotTarget(bulb);
                    }
                    // si he empezado en desde un DOT
                    if (window.currentBulb) {
                        window.currentBulb.addWire(wire);
                        wire.addDotTarget(bulb);
                    }

                    window.dragdropMODE = undefined;
                    window.currentWire = undefined;
                    window.currentBulb = undefined;
                    window.currentDot = undefined;

                    board.reload();

                } else {
                    wire.addWirepart();
                }


            } else if (targetType) { // si no estamos creando un wire

                console.log("FINAL CLICK:", targetType);

                if (window.startTargetType === "WIRE") {
                    if (targetType === "WIRE") {

                        if (e.which === 3) {
                            const wire = board.getWireFromTextureElement(targetElement);
                            board.removeWire(wire.index)
                        }

                    }
                }
                // empezó en component
                if (window.startTargetType === "COMPONENT") {

                    if (targetType === "COMPONENT") {
                        if (e.which === 3) {

                            // log
                            board.removeGate(targetElement)

                            return
                        }
                    }
                    const component = window.startComponent;
                    component.y = parseInt(component.element.css("top"));
                    component.x = parseInt(component.element.css("left"));
                    component.element.css("z-index", "");

                    // mover al final de todos los elementos
                    // para que se vea el primero
                    component.element.insertAfter(board.element.children().last());

                    window.startTarget = undefined;
                    window.startTargetType = undefined;
                }
                if (window.startTargetType === "OUTPUT-DOT") {

                    if (targetType === "OUTPUT-DOT") {

                        if (e.which === 1) {

                            const dotElement = window.startTarget;
                            const dot = board.getDotByElement(dotElement);

                            // inicio la creación de un wire
                            if (window.dragdropMODE !== "CREATING-WIRE") {

                                window.dragdropMODE = "CREATING-WIRE";

                                window.currentWire = board.addWire(dot, undefined);
                                window.currentDot = dot;

                                // si el dot está previamente encendido, encender el cable
                                if (dot.glowed) {
                                    window.currentWire.glow();
                                }
                            }
                        }

                    }

                }
                if (window.startTargetType === "INPUT-BULB") {

                    if (targetType === "INPUT-BULB") {

                        const bulbElement = window.startTarget;
                        const bulb = board.getBulbByElement(bulbElement);

                        if (e.which === 1) {

                            // inicio la creación de un wire
                            if (window.dragdropMODE !== "CREATING-WIRE") {

                                window.dragdropMODE = "CREATING-WIRE";

                                window.currentWire = board.addWire(bulb, undefined);
                                window.currentBulb = bulb;

                                // si el bulb está previamente encendido, encender el cable
                                if (bulb.glowed) {
                                    window.currentWire.glow()
                                }
                            }
                        }
                        if (e.which === 3) {

                            bulb.switch();

                        }


                    }


                }

            }


            window.startComponent = undefined;
            window.startTarget = undefined;
            window.startTargetType = undefined;
            // window.dragdropMODE = undefined;
            // if(window.dragdropMODE === "CREATING-WIRE"){
            // }

        });

        // $(document).on("mousedown", ".dot", function (e) {

        //     const dotElement = $(this);
        //     const dotType = dotElement.data("type");
        //     // const dotType = dotElement.data("type");
        //     const index = parseInt(dotElement.parent().parent().parent().data("index"));
        //     if (index === undefined || index === "") return;
        //     const component = board.gates[index];
        //     const dot = component.dots[dotType];

        //     // si este dot ya tiene wire
        //     if (dot.wire) {
        //         console.log("no", dot);
        //         return;
        //     }

        //     window.componentDotClicking = component;
        //     window.componentDotClickingType = dotType;
        //     window.currentWire = board.addWire(component, dotType);

        //     const dotGlowed = dot.glowed;
        //     if (dotGlowed) {
        //         window.currentWire.glow();
        //     }

        //     const bbox = dotElement[0].getBoundingClientRect();
        //     const x1 = bbox.x - board.x + 3;
        //     const y1 = bbox.y - board.y + 3;

        //     window.currentWire.element.css("left", x1);
        //     window.currentWire.element.css("top", y1);

        // });
        // $(document).on("mousemove", function (e) {

        //     e.preventDefault();

        //     if (window.componentDotClicking === undefined || componentDotClicking === undefined) return;

        //     const wire = window.currentWire;
        //     const componentStart = window.componentDotClicking;
        //     const dot = componentStart.dots[window.componentDotClickingType].element[0];

        //     const bbox = dot.getBoundingClientRect();
        //     const x1 = bbox.x - board.x;
        //     const y1 = bbox.y - board.y;
        //     const x2 = (e.clientX - x1) - board.x;
        //     const y2 = (e.clientY - y1) - board.y;

        //     var a = Math.atan2(x2, y2);
        //     if (a < 0) a += 2 * Math.PI; //angle is now in radians
        //     a -= (Math.PI / 2); //shift by 90deg
        //     if (a < 0) a += 2 * Math.PI;
        //     if (a < 0) a += 2 * Math.PI;
        //     a = Math.abs((Math.PI * 2) - a); //invert rotation
        //     const theta = (a * 180 / Math.PI); //convert to deg

        //     const hipotenuse = Math.hypot(x2, y2);

        //     wire.element.css("left", x1);
        //     wire.element.css("top", y1);

        //     wire.element.children().eq(0).css("width", hipotenuse);
        //     wire.element.css("transform", "rotate(" + theta + "deg)");


        // });

        // $(document).on("mouseup", ".dot", function (e) {

        //     console.log("UP");

        //     const dotElement = $(this);
        //     const index = parseInt(dotElement.parent().parent().parent().data("index"));
        //     if (index === undefined || index === "") return;

        //     const componentStart = window.componentDotClicking;
        //     const componentStartType = window.componentDotClickingType;
        //     const componentTarget = board.gates[index];
        //     const componentTargetType = dotElement.data("type");
        //     const dot = componentStart.dots[componentStartType].element[0];

        //     window.componentDotClicking = undefined;
        //     window.componentDotClickingType = undefined;

        //     if (componentStartType.indexOf("in") !== -1 && componentTargetType.indexOf("in") !== -1) {
        //         dot.wire = undefined;
        //         dot.glowed = undefined;
        //         dragDroper.removeLastWire();
        //         console.log(dot);
        //         return;
        //     }
        //     if (componentStartType.indexOf("out") !== -1 && componentTargetType.indexOf("out") !== -1) {
        //         dot.wire = undefined;
        //         dot.glowed = undefined;
        //         dragDroper.removeLastWire();
        //         console.log(dot);
        //         return;
        //     }
        //     if (componentStart.index === componentTarget.index) {
        //         dot.wire = undefined;
        //         dot.glowed = undefined;
        //         dragDroper.removeLastWire();
        //         console.log(dot);
        //         return;
        //     }

        //     // ha pasado las pruebas
        //     // por lo que el wire está conectado entre dos dots.


        //     const wire = window.currentWire;

        //     wire.componentTarget = componentTarget;
        //     wire.componentTargetType = componentTargetType;
        //     wire.dotStart = wire.componentStart.dots[wire.componentStartType];
        //     wire.dotTarget = componentTarget.dots[componentTargetType];

        //     componentTarget.dots[componentTargetType].wire = wire;

        //     // alineo
        //     wire.reCenter();

        //     // recalculo
        //     board.reload();


        //     window.settingWire = true;
        //     window.currentWire = undefined;
        //     window.componentDotClicking = undefined;
        //     window.componentDotClickingType = undefined;

        // });

        // $(document).on("mouseup", function (e) {
        //     if (window.currentWire) {
        //         if (!window.settingWire) {
        //             console.log("Bye");

        //             const dot = window.componentDotClicking.dots[window.componentDotClickingType];
        //             dot.wire = undefined;
        //             dot.glowed = undefined;
        //             console.log(dot);

        //             dragDroper.removeLastWire();
        //         } else {
        //             window.settingWire = false;
        //         }
        //     }
        // });








        // $(document).on("mouseup", ".ALU-Component", function (e) {


        //     if (window.componentDotClicking !== undefined) return;

        //     const index = this.dataset.index;
        //     const component = board.gates[index];

        //     if (!component) return;

        //     component.y = parseInt(component.element.css("top"));
        //     component.x = parseInt(component.element.css("left"));

        //     component.moving = false;

        //     component.element.css("z-index", "");

        //     console.log("Stop");
        // });

        // $(document).on("mousedown", ".ALU-Component", function (e) {

        //     if (window.componentDotClicking !== undefined) return;
        //     const index = this.dataset.index;
        //     const component = board.gates[index];
        //     if (!component) return;

        //     // console.log(e);

        //     component.moving = true;

        //     component.startX = e.clientX;
        //     component.startY = e.clientY;

        //     component.element.css("z-index", 999);

        //     console.log("Start", component.startX, component.startY);

        // });

        // $(document).on("mousemove", ".ALU-Component", function (e) {

        //     e.preventDefault();
        //     if (window.componentDotClicking !== undefined) return;

        //     const index = this.dataset.index;
        //     if (!index) return;
        //     const component = board.gates[index];
        //     if (!component) return;


        //     if (component.moving) {
        //         const diffX = e.clientX - component.startX;
        //         const diffY = e.clientY - component.startY;

        //         component.element.css("top", diffY + component.y);
        //         component.element.css("left", diffX + component.x);

        //         const dots = Object.entries(component.dots);

        //         for (const [name, dot] of dots) {

        //             if (dot.wire) {
        //                 dot.wire.reCenter();
        //             }

        //         }


        //     }

        // });

        // $(document).on("mousedown", ".wire", function (e) {
        //     if(e.which === 3){
        //         e.preventDefault();
        //         e.stopPropagation();

        //         const index = parseInt($(this).data("index"));

        //         board.removeWire(index);

        //     }
        // });
        $("#board-playground").on("contextmenu", function (e) {
            e.preventDefault();
        });

    }

    // removeLastWire() {
    //     board.wires.pop();
    //     window.currentWire.element.remove();
    //     window.currentWire = undefined;
    //     window.componentDotClicking = undefined;
    //     window.componentDotClickingType = undefined;
    // }
    // onClick() {
    //     const clickedComponent = $(this).data("gate");
    //     board.add(clickedComponent)
    // }

}