import { Application } from "express";
import { createServer, Server } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { MySocket } from "../Interfaces/MySocketInterface";
import { RoomInterface, RoomObjectInterface } from "../Interfaces/RoomInterface";
import { ApiServer } from "../Api/ApiServer";
import RoomInstance from "./RoomInstance";
import { randomUUID } from "crypto";

export default class NewGameServer {
    private app: Application;
    private server: Server;
    private io: SocketIOServer;
    private api: ApiServer;
    private rooms: RoomObjectInterface; 
    private tickTimeout?: NodeJS.Timeout;
    

    constructor(app: Application, api: ApiServer) {
        this.app = app;
        this.api = api;
        this.server = createServer(this.app);
        this.io = new SocketIOServer(this.server, {
            cors: {
                origin: "*",
            },
        });
        this.rooms = {};
        this.listen();
    }

    private listen(): void {
        this.server.listen(process.env.PORT, () => {
            console.log("Running server on port %s", process.env.PORT);
        });

        this.io.on("connect", (socket: MySocket) => {
            console.log("Connected client on port %s.", process.env.PORT);

            socket.on("joinRoom", (roomName: string, password: string) => {
                console.log("User is trying to join room %s.", roomName);

                if (!roomName) {
                    socket.disconnect();
                    return;
                }

                let room: RoomInterface;

                if (!this.rooms[roomName]) {
                    console.log("New room created: %s", roomName);
                    room = new RoomInstance(randomUUID(), roomName, password, this.io, socket, this.api);
                    this.rooms[roomName] = room;
                } else {
                    console.log("Room already exists: %s", roomName);
                    this.rooms[roomName].join(socket, password)
                }
            })
        });
    }
}
