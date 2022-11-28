import { GarbageInterface } from "./GarbageInterace";
export interface PlayerStateInterface {
    playerId?: number | null;
    score: number;
    garbage: GarbageInterface;
}
