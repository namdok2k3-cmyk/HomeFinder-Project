import { Subscriber } from "../../subscriber";

export class CBModel {
    private subscribers: Subscriber[] = [];
    private pressed: boolean = false;

    public addSubscriber(subscriber: Subscriber): void {
        this.subscribers.push(subscriber);
        this.notifySubscribers();
    }

    public toggle(): void {
        this.pressed = !this.pressed;
        this.notifySubscribers();
    }

    public getState(): boolean {
        return this.pressed;
    }

    public updateState(newState: boolean): void {
        this.pressed = newState;
        this.notifySubscribers();
    }

    private notifySubscribers(): void {
        this.subscribers.forEach((subscriber) => subscriber.update());
    }
}
