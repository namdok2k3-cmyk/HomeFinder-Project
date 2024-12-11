import {
    SKContainer,
    Layout,
    SKEvent,
} from "../../../simplekit/src/imperative-mode";
import { RBController } from "./rbcontroller";
import { RBModel } from "./rbmodel";
import { RBView } from "./rbview";
import { RBGroup } from "./rbgroup";

type EventHandler = (event: SKEvent) => boolean | void;

export class SKRadioButton extends SKContainer {
    private view: RBView;
    private model: RBModel;
    private controller: RBController;

    get text(): string {
        return this.model.text;
    }

    constructor(
        x = 0,
        y = 0,
        width = 200,
        height = 50,
        rbgroup: RBGroup,
        text = "",
        fill = "lightgrey",
        fillPressed = "grey",
    ) {
        super({ x, y, width, height });
        this.layoutMethod = Layout.makeFixedLayout();

        // Initialize model, controller, and view
        this.model = new RBModel(rbgroup, text);
        this.controller = new RBController(this.model);
        this.view = new RBView(this.model, fill, fillPressed, text, width, height);

        // Add the button to the group and set up bindings
        rbgroup.addButton(this.model);
        this.model.addSubscriber(this.view);
        this.view.bindController(this.controller);

        // Add the view to the container
        this.addChild(this.view);
    }
    get buttonText(){
        return this.model.buttonText;
    }
    addEventListener(type: string, handler: EventHandler, capture = false): void {
        this.view.addEventListener(type, handler, capture);
    }
}
