import express from "express";
import { createServer, Server } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { GarbageThrownOutInterface } from "./Interfaces/GarbageThrownOutInterface";
import { MySocket } from "./Interfaces/MySocketInterface";
import { INIT_TIME_LEFT, SECOND_IN_MILI, TICK_RATE_MS } from "./constants";
import { RoomInterface, RoomObjectInterface } from "./Interfaces/RoomInterface";
import { getRandomGarbageAndLocation } from "./Helpers/gameStateHelpers";
import { GameStateInterface } from "./Interfaces/GameStateInterface";
import { ClientsObjectInterface } from "./Interfaces/ClientInterface";

const initialGarbage = {
    type: "",
    description: "",
    imageName: "DEFAULT",
};

const initialGameState: GameStateInterface = {
    status: "notStarted",
    garbage: getRandomGarbageAndLocation(),
    timeLeft: INIT_TIME_LEFT,
}

export default class GameServer {
    private app: express.Application;
    private server: Server;
    private io: SocketIOServer;
    private rooms: RoomObjectInterface; 

    constructor() {
        this.app = express();
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

            socket.on("joinRoom", (roomName: string) => {
                socket.join(roomName);

                let room: RoomInterface;
                if (!this.rooms[roomName]) {
                    room = (this.rooms[roomName] = {
                        roomName,
                        clients: {},
                        gameState: initialGameState,
                        timer: undefined
                    });
                } else {
                    room = this.rooms[roomName];
                }

                const clients = room.clients;

                clients[socket.id] = {
                    id: socket.id,
                    position: [0, 0, 0],
                    ready: false,
                    score: 0,
                    garbage: initialGarbage,
                    correctAnswer: "",
                };


                const tick = this.startTickRateTimer(socket, room);

                this.io.to(roomName).emit("updateGameState", room.gameState);
                this.io.to(roomName).emit("updateClients", clients);

                socket.on("setPlayerId", (response: string) => {
                    this.rooms[roomName].clients[socket.id].playerId = response;
                })

                socket.on("garbagePickedUp", () =>
                    this.handleGarbagePickedUp(socket, room)
                );

                socket.on(
                    "garbageThrownOut",
                    (response: GarbageThrownOutInterface) =>
                        this.handleGarbageThrownOut(socket, response, room)
                );

                socket.on("ready", () => {
                    clients[socket.id].ready = true;
                    this.io.to(roomName).emit("ready", clients);
                    if (
                        Object.values(clients).every(
                            (client) => client.ready === true
                        )
                    ) {
                        this.startTimer(room);
                        room.gameState.status = "active";
                        this.io.to(roomName).emit("updateGameState", room.gameState);
                    }
                });

                socket.on("pause", () => {
                    clients[socket.id].ready = false;
                    room.gameState.status = "paused";
                });

                socket.on("disconnect", () => {
                    clearInterval(tick);
                    delete clients[socket.id];
                });

            })
        });
    }

    private handleGarbagePickedUp(
        socket: MySocket, room: RoomInterface 
    ): void {
        room.clients[socket.id].garbage = room.gameState.garbage;
        room.clients[socket.id].correctAnswer = "";
        room.gameState.garbage = getRandomGarbageAndLocation();
        socket.emit("updateGameState", room.gameState);
        this.io.to(room.roomName).emit("updateClients", room.clients);
    }

    private handleGarbageThrownOut(
        socket: MySocket,
        response: GarbageThrownOutInterface,
        room: RoomInterface
    ): void {
        if (response.trashCanType === room.clients[socket.id]?.garbage?.type) {
            ++room.clients[socket.id].score;
            room.clients[socket.id].garbage = initialGarbage;
        } else {
            const type = room.clients[socket.id]?.garbage?.type;
            room.clients[socket.id].correctAnswer = type ?? "";
            room.clients[socket.id].garbage = initialGarbage;
        }
    }

    private setInitialGameState(room: RoomInterface): void {
        room.gameState.status = "inactive";
        Object.entries(room.clients).forEach(([key, client]) => {
            client.ready = false;
            client.position = [0, 0, 0];
            client.garbage = initialGarbage;
        });
        this.io.to(room.roomName).emit("updateGameState", room.gameState);
        this.io.to(room.roomName).emit("updateClients", room.clients);
    }

    public startTimer(room: RoomInterface): void {
        room.timer = setInterval(() => {
            this.updateTimer(room);
        }, SECOND_IN_MILI);
    }

    public startTickRateTimer(
        socket: MySocket, 
        room: RoomInterface
    ): NodeJS.Timeout {
        return setInterval(() => {
            this.tick(socket, room);
        }, TICK_RATE_MS);
    }

    private updateTimer(room: RoomInterface): void {
        room.gameState.timeLeft--;
        if (room.gameState.timeLeft < 0) {
            room.gameState.timeLeft = INIT_TIME_LEFT;
            clearInterval(room.timer);
            this.setInitialGameState(room);
        }
    }

    private async tick(socket: MySocket, room: RoomInterface) {
        if (Object.keys(room.clients).length) {
            socket.emit(
                "updateClients", 
                room.clients, 
                (position: [number,number,number]) => {
                    room.clients[socket.id].position = position;
                }
            );
            this.io.to(room.roomName).emit("updateGameState", room.gameState);
        }
    }
}
