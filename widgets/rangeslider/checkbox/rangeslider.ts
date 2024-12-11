import {
    Layout,
    SKContainer,
    SKEvent,
    SKLabel,
    SKTextfield,
} from "../../../simplekit/src/imperative-mode";

export class SKRangeSlider extends SKContainer {
    public currMin: number;
    public currMax: number;
    public minInput: SKTextfield;
    public maxInput: SKTextfield;
    private maxLabel:SKLabel = new SKLabel({text:"Max"});
    private minLabel:SKLabel = new SKLabel({text:"Min"});
    dispatchEvent: any;

    constructor(min: number, max: number, width: number) {
        super({ width: width });

        // Initialize current min and max values
        this.currMin = min;
        this.currMax = max;

        // Create input fields for min and max values
        this.minInput = new SKTextfield();
        this.maxInput = new SKTextfield();

        // Set initial values in the input fields
        this.minInput.text = `${this.currMin}`;
        this.maxInput.text = `${this.currMax}`;

        // Set input widths dynamically
        this.minInput.width = width / 2 - 10;
        this.maxInput.width = width / 2 - 10;
        this.height = this.minInput.height + 40; // Adjust height for buttons

        // Add event listeners for real-time input handling
        this.minInput.addEventListener("textchanged", () => this.handleInputChange());
        this.maxInput.addEventListener("textchanged", () => this.handleInputChange());

        // Add inputs to the container and set layout
        this.layoutMethod = Layout.makeWrapRowLayout();
        this.minLabel.width = this.minInput.width
        this.maxLabel.width = this.maxInput.width
        this.addChild(this.minLabel);
        this.addChild(this.maxLabel);
        this.addChild(this.minInput);
        this.addChild(this.maxInput);

    }

    // Handle changes in the input fields
    private handleInputChange() {
        const minValue = parseFloat(this.minInput.text || "0");
        const maxValue = parseFloat(this.maxInput.text || "0");

        if (minValue <= maxValue) {
            // Update current values
            this.currMin = minValue;
            this.currMax = maxValue;

            // Emit an update event with the new range
            this.sendEvent({
                source: this,
                timeStamp: Date.now(),
                type: "update",
            } as SKEvent);
        } else {
            // Optionally, handle invalid input gracefully
            console.warn("Minimum value cannot exceed maximum value.");
        }
    }

    // Increment range values
    private incrementRange() {
        this.setValues(this.currMin + 1, this.currMax + 1);
    }

    // Decrement range values
    private decrementRange() {
        this.setValues(this.currMin - 1, this.currMax - 1);
    }

    // Get the current range values
    public getValues() {
        return { min: this.currMin, max: this.currMax };
    }

    // Set the range values externally
    public setValues(min: number, max: number) {
        if (min <= max) {
            this.currMin = min;
            this.currMax = max;

            this.minInput.text = `${min}`;
            this.maxInput.text = `${max}`;
        } else {
            console.warn("Invalid range: Minimum value cannot exceed maximum value.");
        }
    }
}