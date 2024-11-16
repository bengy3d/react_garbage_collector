import { UUID } from "crypto";
import { ClientsObjectInterface } from "./ClientInterface";
import { GameStateInterface } from "./GameStateInterface";
import { MySocket } from "./MySocketInterface";

export interface RoomInterface{
    id: UUID;
    name: string;
    password: string;
    clients: ClientsObjectInterface;
    gameState: GameStateInterface;
    timer?: NodeJS.Timeout;
    availableColors: string[];

    join(socket: MySocket, password: string): boolean;
}

export interface RoomObjectInterface {
    [value: string]: RoomInterface;
}
