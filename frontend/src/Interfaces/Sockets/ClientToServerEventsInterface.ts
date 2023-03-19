import { MoveInterface } from "./MoveInterface";

export interface ClientToServerEventsInterface {
    move: (movement: MoveInterface) => void;
    ready: () => void;
    hello: () => void;
}