import { RBModel } from "./rbmodel";

export class RBController {
    private model: RBModel;

    constructor(model: RBModel) {
        this.model = model;
    }

    public handleToggle(): void {
        this.model.toggleState();
    }
}
