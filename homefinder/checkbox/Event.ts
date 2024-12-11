export interface SKEvent {
  type: string;
  target: any;
}

export interface SKKeyboardEvent extends SKEvent {
  key: string;
  code: string;
}

export interface SKMouseEvent extends SKEvent {
  x: number;
  y: number;
  button: number;
}
