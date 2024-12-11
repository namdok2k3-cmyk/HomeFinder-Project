import { SKContainer, SKLabel } from '../../../simplekit/src/imperative-mode';
import { RSModel } from './rbmodel';

export class RSView extends SKContainer{
    private model: RSModel;
    private minLabel: SKLabel;
    private maxLabel: SKLabel;


    constructor( model: RSModel) {
        super()
        this.model = model;

        // Create labels to display min and max values
        this.minLabel = new SKLabel();
        this.maxLabel = new SKLabel();

        // Add labels to the container
        this.addChild(this.minLabel);
        this.addChild(this.maxLabel);
    }


    draw(ctx: CanvasRenderingContext2D){

        if (!ctx) return;

        ctx.clearRect(0, 0, this.model.getWidth(), 50);

        // Draw the track
        ctx.fillStyle = 'lightgray';
        ctx.fillRect(0, 20, this.model.getWidth(), 10);

        // Draw the selected range
        ctx.fillStyle = 'blue';
        ctx.fillRect(
            this.model.getLeftHandle(),
            20,
            this.model.getRightHandle() - this.model.getLeftHandle(),
            10
        );

        // Draw the left handle
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.model.getLeftHandle(), 25, 5, 0, Math.PI * 2);
        ctx.fill();

        // Draw the right handle
        ctx.beginPath();
        ctx.arc(this.model.getRightHandle(), 25, 5, 0, Math.PI * 2);
        ctx.fill();

        // Update labels
        const { min, max } = this.model.getValues();
        this.minLabel.setText(`Min: ${min}`);
        this.maxLabel.setText(`Max: ${max}`);
    }
}
