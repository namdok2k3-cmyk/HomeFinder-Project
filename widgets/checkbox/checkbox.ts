import { Layout, SKContainer, SKEvent } from "../../simplekit/src/imperative-mode";
import { CBController } from "./cbcontroller";
import { CBModel } from "./cbmodel";
import { CBView } from "./cbview";

export class CheckBox extends SKContainer {
    private _label:string;
    private model: CBModel;
    private view: CBView;
    private controller: CBController;

    constructor(
        x = 0,
        y = 0,
        width = 100,
        height = 50,
        fillColor = "lightgrey",
        pressedColor = "grey",
        label=""
    ) {
        super({
            x: x,
            y: y,
            width: width,
            height: height,
        });

        this.fill = "transparent";
        this.model = new CBModel();
        this.controller = new CBController();
        this.view = new CBView(this.model, fillColor, pressedColor,height,width,label);
        this.height = this.view.height
        this.width = this.view.width
        this._label = label

        this.controller.assignModel(this.model);
        this.view.setController(this.controller);
        this.layoutMethod = Layout.makeFixedLayout();

        this.model.addSubscriber(this.view);
        this.addChild(this.view);
    }
    get label(){
        return this._label
    }
    draw(gc: CanvasRenderingContext2D): void {
        super.draw(gc);
    }

    addEventListener(
        type: string,
        handler: (me: SKEvent) => boolean | void,
        capture = false
    ): void {
        this.view.addEventListener(type, handler, capture);
    }
}
