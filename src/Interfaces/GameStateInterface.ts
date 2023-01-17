export interface GameStateInterface {
    status: "active" | "inactive" | "notStarted";
    timeLeft: number;
}