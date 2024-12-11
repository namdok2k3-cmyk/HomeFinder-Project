import { SKButton, SKContainer, SKEvent } from "../../simplekit/src/imperative-mode";
import { CBModel } from "./cbmodel";
import { CBController } from "./cbcontroller";
import { Subscriber } from "../../subscriber";

export class CBView extends SKContainer implements Subscriber {
    private checkbox: CBModel;
    private button: SKButton;
    private fillColor: string;
    private pressedColor: string;

    constructor(
        model: CBModel,
        fillColor: string,
        pressedColor: string,
        height:number,
        width:number,
        label:string
    ) {
        super();
        this.checkbox = model; // directly use model
        this.button = new SKButton({text:label});
        this.width = this.button.width
        this.height = this.button.height
        this.fillColor = fillColor;
        this.pressedColor = pressedColor;
        this.button.fill = this.fillColor;
        this.addChild(this.button);
    }

    setController(controller: CBController): void {
        this.button.addEventListener("action", (event: SKEvent) => {
            controller.handleToggle(event); // Pass the event to the controller
        });
    }

    update(): void {
        if (this.checkbox.getState()) {
            this.button.fill = this.pressedColor;
            this.sendEvent({
                source: this,
                timeStamp: Date.now(),
                type: "on",
            } as SKEvent);
        } else {
            this.button.fill = this.fillColor;
            this.sendEvent({
                source: this,
                timeStamp: Date.now(),
                type: "off",
            } as SKEvent);
        }
    }
}
