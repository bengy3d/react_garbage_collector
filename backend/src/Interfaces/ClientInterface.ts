import { GarbageInterface } from "./GarbageInterface";

export interface ClientInterface {
    id?: string;
    position: [number, number, number];
    ready: boolean;
    score: number;
    correctAnswer: string;
    garbage?: GarbageInterface;
    playerId?: string;
}

export interface ClientsObjectInterface {
    [value: string]: ClientInterface;
}