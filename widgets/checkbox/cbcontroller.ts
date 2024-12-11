import { SKEvent } from "../../simplekit/src/imperative-mode";
import { CBModel } from "./cbmodel";

export class CBController {
    private model!: CBModel;

    assignModel(model: CBModel): void {
        this.model = model;
    }

    handleToggle(event: SKEvent): void {
        console.log("Event triggered:", event.type, event.timeStamp); // Log event details
        const currentState = this.model.getState();
        this.model.updateState(!currentState);
    }
}
