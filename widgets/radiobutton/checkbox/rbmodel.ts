import { Subscriber } from "../../../subscriber";
import { RBGroup } from "./rbgroup";

export class RBModel {
    private subscribers: Subscriber[] = [];
    private group: RBGroup;
    private _buttonText: string;
    private _isPressed: boolean = false;

    set isPressed(p:boolean){
        this._isPressed = p
        this.notifySubscribers();

    }
    get isPressed(){
        return this._isPressed
    }

    get buttonText(){
        return this._buttonText
    }

    constructor(group: RBGroup, text: string) {
        this.group = group;
        this._buttonText = text;
    }

    get text(): string {
        return this._buttonText;
    }

    set text(value: string) {
        this._buttonText = value;
        this.notifySubscribers();
    }

    public toggleState(): void {
        this.group.updateSelection(this);
        this.notifySubscribers();
    }

    public addSubscriber(subscriber: Subscriber): void {
        this.subscribers.push(subscriber);
        this.notifySubscribers();
    }

    private notifySubscribers(): void {
        this.subscribers.forEach((subscriber) => subscriber.update());
    }
}
