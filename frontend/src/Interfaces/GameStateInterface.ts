import { GarbageInterface } from "./GarbageInterace";

export interface GameStateInterface {
    status: "active" | "inactive" | "notStarted" | "paused";
    timeLeft: number;
    garbage?: GarbageInterface;
}
