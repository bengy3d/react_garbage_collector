import { GarbageInterface } from "./GarbageInterface";

export interface GameStateInterface {
    status: "active" | "inactive" | "notStarted" | "paused";
    garbage: GarbageInterface;
    timeLeft: number;
}
