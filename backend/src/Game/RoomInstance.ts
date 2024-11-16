import { UUID } from "crypto";
import { Server as SocketIOServer } from "socket.io";
import { ApiServer } from "../Api/ApiServer";
import { GAME_DURATION, PLAYER_COLORS, TICK_RATE_MS } from "../constants";
import { ClientsObjectInterface } from "../Interfaces/ClientInterface";
import { GameStateInterface } from "../Interfaces/GameStateInterface";
import { MySocket } from "../Interfaces/MySocketInterface";
import { RoomInterface } from "../Interfaces/RoomInterface";
import Client from "./Entities/Client";
import Garbage from "./Entities/Garbage";

const initialGameState: GameStateInterface = {
    status: "notStarted",
    garbage: new Garbage(true),
    timeLeft: GAME_DURATION,
}

export default class RoomInstance implements RoomInterface {
    id: UUID;
    name: string;
    password: string;
    clients: ClientsObjectInterface;
    gameState: GameStateInterface;
    timer?: NodeJS.Timeout;
    availableColors: string[];

    private io: SocketIOServer;
    private tickRate: NodeJS.Timeout;
    private api: ApiServer;

    constructor(
        id: UUID, 
        roomName: string,
        password: string,
        io: SocketIOServer,
        socket: MySocket,
        api: ApiServer
    ) {
        this.id = id;
        this.name = roomName;
        this.password = password;
        this.clients = {};
        this.availableColors = PLAYER_COLORS;
        this.gameState = initialGameState;
        this.io = io;
        this.api = api;
        this.join(socket, password);
        this.tickRate = this.startTickRate(this.clients, this.gameState);
    }

    public join(socket: MySocket, password: string): boolean {
        if (this.password === password) {
            socket.join(this.name);
        } else {
            socket.disconnect();
            return false;
        }
        console.info("User %s connected", socket.id);
        this.initializePlayer(socket);
        return true;
    }

    private initializePlayer(socket: MySocket) {
        const color = this.availableColors.pop() as string;
        this.clients[socket.id] = new Client(
            color, 
            socket,
            () => this.ready(),
            () => this.getGarbageAndInitNew()
        );
        console.info("Player %s was initalized", socket.id);

        this.api.setRoomMetadata(
            this.name, 
            Object.keys(this.clients).length
        );
        socket.on("disconnect", () => {
            this.availableColors.push(color)
            console.log("User: %s has disconnected", socket.id);
            delete this.clients[socket.id];
            if (!Object.keys(this.clients).length) {
                clearInterval(this.tickRate);
                // TODO: add callback to delete room
                this.api.removeRoomMetadata(this.name);
                //delete this.rooms[roomName]; 
            } else {
                // TODO: add callback to update roomMetadata
                this.api.setRoomMetadata(
                    this.name, 
                    Object.keys(this.clients).length
                );
            }
        });
    }

    private startTickRate(
        clients: ClientsObjectInterface,
        gameState: GameStateInterface
    ): NodeJS.Timeout {
        return setInterval(() => {
            for (const client of Object.values(clients)) {
                client.getSocket().emit(
                    "updateClients", 
                    clients, 
                    (position: [number,number,number]) => {
                        if (position instanceof Array) {
                            client.position = position;
                        }
                    }
                );
            }
            this.io.to(this.name).emit("updateGameState", gameState);
        }, TICK_RATE_MS);
    }


    private ready() {
        this.io.to(this.name).emit("ready", this.clients);
        if (
            Object.values(this.clients).every(
                (client) => client.ready === true
            ) 
            && !this.timer
        ) {
            this.startTimer(this);
            this.gameState.status = "active";
        }

    }
    
    private getGarbageAndInitNew() {
        const garbage = this.gameState.garbage;
        this.gameState.garbage = new Garbage(true);
        return garbage;
    }

    public startTimer(room: RoomInterface): void {
        if (!room.timer) {
            room.timer = setInterval(() => {
                this.updateTimer(room);
            }, 1000);
        }
    }

    private updateTimer(room: RoomInterface): void {
        room.gameState.timeLeft--;
        if (room.gameState.timeLeft < 0) {
            room.gameState.timeLeft = GAME_DURATION;
            clearInterval(room.timer);
            room.timer = undefined;
            this.setInitialGameState(room);
        }
    }

    private setInitialGameState(room: RoomInterface): void {
        room.gameState.status = "inactive";
        for (const client of Object.values(room.clients)) {
            client.resetGameState();
        }
    }


    public dispose() {
        clearInterval(this.tickRate);
    }
}
