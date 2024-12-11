import { SKButton, SKContainer } from "../../../simplekit/src/imperative-mode";
import { RBModel } from "./rbmodel";
import { RBController } from "./rbcontroller";
import { Subscriber } from "../../../subscriber";

export class RBView extends SKContainer implements Subscriber {
    private model: RBModel;
    private button: SKButton;
    private defaultFill: string;
    private activeFill: string;


    constructor(
        model: RBModel,
        defaultFill: string,
        activeFill: string,
        text: string,
        width: number,
        height: number
    ) {
        super();
        this.model = model;
        this.defaultFill = defaultFill;
        this.activeFill = activeFill;

        // Create and style the button
        this.button = new SKButton({
            width,
            height,
            text,
            fill: this.defaultFill,
        });

        this.addChild(this.button);
    }

    public bindController(controller: RBController): void {
        this.button.addEventListener("action", () => controller.handleToggle());
    }

    public update(): void {
        // Update button fill and text based on the model state
        this.button.fill = this.model.isPressed ? this.activeFill : this.defaultFill;
        this.button.text = this.model.text;
    }
}
