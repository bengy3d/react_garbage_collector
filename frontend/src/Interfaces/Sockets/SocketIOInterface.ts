import { Socket } from "socket.io-client";
import { ClientToServerEventsInterface } from "./ClientToServerEventsInterface";
import { ServerToClientEventsInterface } from "./ServerToClientEventsInterface";

export interface SocketIOInterface
    extends Socket<
        ServerToClientEventsInterface,
        ClientToServerEventsInterface
    > {
    id: string;
}

export type MySocket = SocketIOInterface;
