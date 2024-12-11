export class RSModel {
    private minValue: number;
    private maxValue: number;
    private currentMin: number;
    private currentMax: number;
    private sliderWidth: number;
    private leftHandle: number;
    private rightHandle: number;
    private draggingLeft: boolean = false;
    private draggingRight: boolean = false;

    constructor(minValue: number, maxValue: number, sliderWidth: number) {
        this.minValue = minValue;
        this.maxValue = maxValue;
        this.currentMin = minValue;
        this.currentMax = maxValue;
        this.sliderWidth = sliderWidth;
        this.leftHandle = 0;
        this.rightHandle = sliderWidth;
    }

    public startDragging(position: number): void {
        if (Math.abs(position - this.leftHandle) < 10) {
            this.draggingLeft = true;
        } else if (Math.abs(position - this.rightHandle) < 10) {
            this.draggingRight = true;
        }
    }

    public dragHandle(position: number): void {
        if (this.draggingLeft) {
            this.leftHandle = Math.max(0, Math.min(position, this.rightHandle - 10));
            this.updateValues();
        } else if (this.draggingRight) {
            this.rightHandle = Math.min(this.sliderWidth, Math.max(position, this.leftHandle + 10));
            this.updateValues();
        }
    }

    public stopDragging(): void {
        this.draggingLeft = false;
        this.draggingRight = false;
    }

    private updateValues(): void {
        this.currentMin = Math.round(
            (this.leftHandle / this.sliderWidth) * (this.maxValue - this.minValue) + this.minValue
        );
        this.currentMax = Math.round(
            (this.rightHandle / this.sliderWidth) * (this.maxValue - this.minValue) + this.minValue
        );
    }

    public getValues(): { min: number; max: number } {
        return { min: this.currentMin, max: this.currentMax };
    }

    public getLeftHandle(): number {
        return this.leftHandle;
    }

    public getRightHandle(): number {
        return this.rightHandle;
    }

    public getWidth(): number {
        return this.sliderWidth;
    }
}
