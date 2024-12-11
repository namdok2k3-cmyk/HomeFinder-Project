import { RSModel } from './rbmodel';
import { RSView } from './rbview';
import { SKMouseEvent } from '../../../simplekit/src/imperative-mode';

export class RSController {
    private model: RSModel;
    private view: RSView;

    constructor(model: RSModel, view: RSView) {
        this.model = model;
        this.view = view;
    }

    // Handles mouse interactions for the slider
    public mouseClick(event: SKMouseEvent): void {
        const { type, x } = event;

        if (type === 'mousedown') {
            this.model.startDragging(x);
        } else if (type === 'mousemove') {
            this.model.dragHandle(x);
        } else if (type === 'mouseup') {
            this.model.stopDragging();
        }
    }
}
