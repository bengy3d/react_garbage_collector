import { GarbageInterface } from "../GarbageInterace";

export interface ClientInterface {
    id?: string;
    position: [number, number, number];
    ready: boolean;
    score: number;
    color: string;
    correctAnswer: string;
    garbage: GarbageInterface;
    playerId?: string;
}

export interface ClientsObjectInterface {
    [value: string]: ClientInterface;
}
