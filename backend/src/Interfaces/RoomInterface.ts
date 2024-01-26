import { ClientsObjectInterface } from "./ClientInterface";
import { GameStateInterface } from "./GameStateInterface";

export interface RoomInterface{
    roomName: string;
    clients: ClientsObjectInterface;
    gameState: GameStateInterface;
    timer: NodeJS.Timeout | undefined;
}

export interface RoomObjectInterface {
    [value: string]: RoomInterface;
}
