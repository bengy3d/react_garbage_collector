import { Application } from "express";
import { createServer, Server } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { GarbageThrownOutInterface } from "./Interfaces/GarbageThrownOutInterface";
import { MySocket } from "./Interfaces/MySocketInterface";
import { INIT_TIME_LEFT, SECOND_IN_MILI, TICK_RATE_MS } from "./constants";
import { RoomInterface, RoomObjectInterface } from "./Interfaces/RoomInterface";
import { getRandomGarbageAndLocation } from "./Helpers/gameStateHelpers";
import { GameStateInterface } from "./Interfaces/GameStateInterface";
import { ApiServer } from "./ApiServer";

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
    private app: Application;
    private server: Server;
    private io: SocketIOServer;
    private api: ApiServer;
    private rooms: RoomObjectInterface; 
    private count : number;

    constructor(app: Application, api: ApiServer) {
        this.app = app;
        this.api = api;
        this.server = createServer(this.app);
        this.io = new SocketIOServer(this.server, {
            cors: {
                origin: "*",
            },
        });
        this.count = 0;
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
                if (!roomName) {
                    socket.disconnect();
                    return;
                }

                let room: RoomInterface;

                if (!this.rooms[roomName]) {
                    room = (this.rooms[roomName] = {
                        name: roomName,
                        password,
                        clients: {},
                        gameState: initialGameState,
                        timer: undefined
                    });
                } else if (this.rooms[roomName].password === password) {
                    room = this.rooms[roomName];
                } else {
                    socket.disconnect();
                    return;
                }

                socket.join(roomName);

                const clients = room.clients;
                const playerId = socket.id;

                clients[playerId] = {
                    id: playerId,
                    position: [0, 0, 0],
                    ready: false,
                    score: 0,
                    garbage: initialGarbage,
                    correctAnswer: "",
                };

                this.api.setRoomMetadata(
                    roomName, 
                    Object.keys(clients).length
                );


                const tick = this.startTickRateTimer(socket, room);


                socket.on("setPlayerId", (response: string) => {
                    clients[playerId].playerId = response;
                })

                socket.on("garbagePickedUp", () =>
                    this.handleGarbagePickedUp(playerId, room)
                );

                socket.on(
                    "garbageThrownOut",
                    (response: GarbageThrownOutInterface) =>
                        this.handleGarbageThrownOut(playerId, response, room)
                );

                socket.on("ready", () => {
                    clients[playerId].ready = true;
                    this.io.to(roomName).emit("ready", clients);
                    if (
                        Object.values(clients).every(
                            (client) => client.ready === true
                        ) 
                        && !room.timer
                    ) {
                        this.startTimer(room);
                        room.gameState.status = "active";
                    }
                });

                socket.on("pause", () => {
                    clients[playerId].ready = false;
                    room.gameState.status = "paused";
                });

                socket.on("disconnect", () => {
                    clearInterval(tick);
                    delete clients[playerId];
                    if (!Object.keys(clients).length) {
                        delete this.rooms[roomName]; 
                        this.api.removeRoomMetadata(roomName);
                    } else {
                        this.api.setRoomMetadata(
                            roomName, 
                            Object.keys(clients).length
                        );
                    }
                });

            })
        });
    }

    private handleGarbagePickedUp(
        playerId: string, room: RoomInterface 
    ): void {
        room.clients[playerId].garbage = room.gameState.garbage;
        room.clients[playerId].correctAnswer = "";
        room.gameState.garbage = getRandomGarbageAndLocation();
    }

    private handleGarbageThrownOut(
        playerId: string,
        response: GarbageThrownOutInterface,
        room: RoomInterface
    ): void {
        if (response.trashCanType === room.clients[playerId]?.garbage?.type) {
            ++room.clients[playerId].score;
            room.clients[playerId].garbage = initialGarbage;
        } else {
            const type = room.clients[playerId]?.garbage?.type;
            room.clients[playerId].correctAnswer = type ?? "";
            room.clients[playerId].garbage = initialGarbage;
        }
    }

    private setInitialGameState(room: RoomInterface): void {
        room.gameState.status = "inactive";
        Object.entries(room.clients).forEach(([_, client]) => {
            client.ready = false;
            client.position = [0, 0, 0];
            client.garbage = initialGarbage;
        });
    }

    public startTimer(room: RoomInterface): void {
        if (!room.timer) {
            room.timer = setInterval(() => {
                this.updateTimer(room);
            }, SECOND_IN_MILI);
        }
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
            room.timer = undefined;
            this.setInitialGameState(room);
        }
    }

    private async tick(socket: MySocket, room: RoomInterface) {
        if (Object.keys(room.clients).length) {
            socket.emit(
                "updateClients", 
                room.clients, 
                (position: [number,number,number]) => {
                    if (position instanceof Array) {
                        room.clients[socket.id].position = position;
                    }
                }
            );
            this.io.to(room.name).emit("updateGameState", room.gameState);
        }
    }
}
