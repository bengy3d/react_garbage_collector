import { GarbageInterface } from "./GarbageInterface";
import { MySocket } from "./MySocketInterface";

export interface ClientInterface {
    id: string;
    position: [number, number, number];
    ready: boolean;
    score: number;
    color: string;
    correctAnswer: string;
    garbage: GarbageInterface;
    playerId?: string;
    
    resetGameState(): void;
    incrementScore(): void;
    setIncorrectAnswer(): void;
    setGarbage(garbage: GarbageInterface): void; 
    getSocket(): MySocket;
}

export interface ClientsObjectInterface {
    [value: string]: ClientInterface;
}
