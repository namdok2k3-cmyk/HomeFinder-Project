import { SKEvent, SKElement } from "../../../simplekit/src/imperative-mode";
import { RBModel } from "./rbmodel";

export class RBGroup extends SKElement{
    private buttons: RBModel[] = [];
    private currentlySelected: RBModel | null = null;

    public addButton(button: RBModel): void {
        this.buttons.push(button);
    }

    public updateSelection(selected: RBModel|null): void {
        console.log("here")
        if (selected === this.currentlySelected){
            selected = null
        }
        // Update pressed states
        this.buttons.forEach((button) => {
            button.isPressed = button === selected;
            console.log(button === selected)
        });
        this.currentlySelected = selected;
        if (this.currentlySelected){
            this.sendEvent({
                source: this,
                timeStamp: Date.now(),
                type: this.currentlySelected.buttonText,
            } as SKEvent);
        }
        else{
            this.sendEvent({
                source: this,
                timeStamp: Date.now(),
                type: "none",
            } as SKEvent);
        }
    }

    public getSelected(): RBModel | null {
        return this.currentlySelected;
    }
}
