import { Socket } from "socket.io";

export interface MySocket extends Socket {
    id: string;
}
