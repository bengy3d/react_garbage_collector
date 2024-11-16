//import { Application } from "express";
//import { createServer, Server } from "http";
//import { Server as SocketIOServer, Socket } from "socket.io";
//import { GarbageThrownOutInterface } from "../Interfaces/GarbageThrownOutInterface";
//import { MySocket } from "../Interfaces/MySocketInterface";
//import { GAME_DURATION, SECOND_IN_MILI, TICK_RATE_MS } from "../constants";
//import { RoomInterface, RoomObjectInterface } from "../Interfaces/RoomInterface";
//import { GameStateInterface } from "../Interfaces/GameStateInterface";
//import { ApiServer } from "../Api/ApiServer";
//import Garbage from "./Entities/Garbage";
//import Client from "./Entities/Client";
//
//
//const initialGameState: GameStateInterface = {
//    status: "notStarted",
//    garbage: new Garbage(true),
//    timeLeft: GAME_DURATION,
//}
//
//
//export default class GameServer {
//    private app: Application;
//    private server: Server;
//    private io: SocketIOServer;
//    private api: ApiServer;
//    private rooms: RoomObjectInterface; 
//
//    constructor(app: Application, api: ApiServer) {
//        this.app = app;
//        this.api = api;
//        this.server = createServer(this.app);
//        this.io = new SocketIOServer(this.server, {
//            cors: {
//                origin: "*",
//            },
//        });
//        this.rooms = {};
//        this.listen();
//    }
//
//    private listen(): void {
//        this.server.listen(process.env.PORT, () => {
//            console.log("Running server on port %s", process.env.PORT);
//        });
//
//        this.io.on("connect", (socket: MySocket) => {
//            console.log("Connected client on port %s.", process.env.PORT);
//
//            socket.on("joinRoom", (roomName: string, password: string) => {
//                if (!roomName) {
//                    socket.disconnect();
//                    return;
//                }
//
//                let room: RoomInterface;
//
//                if (!this.rooms[roomName]) {
//                    room = (this.rooms[roomName] = {
//                        name: roomName,
//                        password,
//                        clients: {},
//                        availableColors: ["green", "blue", "yellow", "black"],
//                        gameState: initialGameState,
//                        timer: undefined
//                    });
//                } else if (this.rooms[roomName].password === password) {
//                    room = this.rooms[roomName];
//                } else {
//                    socket.disconnect();
//                    return;
//                }
//
//                socket.join(roomName);
//
//                const clients = room.clients;
//                const clientId = socket.id;
//                const color = room.availableColors.pop() as string;
//                console.log(color);
//
//                clients[clientId] = new Client(clientId, color);
//
//                this.api.setRoomMetadata(
//                    roomName, 
//                    Object.keys(clients).length
//                );
//
//
//                const tick = this.startTickRateTimer(socket, room);
//
//
//                socket.on("setPlayerId", (playerId: string) => {
//                    clients[clientId].setPlayerId(playerId);
//                })
//
//                socket.on("garbagePickedUp", () =>
//                    this.handleGarbagePickedUp(clientId, room)
//                );
//
//                socket.on(
//                    "garbageThrownOut",
//                    (response: GarbageThrownOutInterface) =>
//                        this.handleGarbageThrownOut(clientId, response, room)
//                );
//
//                socket.on("ready", () => {
//                    clients[clientId].ready = true;
//                    this.io.to(roomName).emit("ready", clients);
//                    if (
//                        Object.values(clients).every(
//                            (client) => client.ready === true
//                        ) 
//                        && !room.timer
//                    ) {
//                        this.startTimer(room);
//                        room.gameState.status = "active";
//                    }
//                });
//
//                socket.on("disconnect", () => {
//                    room.availableColors.push(clients[clientId].color)
//                    clearInterval(tick);
//                    delete clients[clientId];
//                    if (!Object.keys(clients).length) {
//                        delete this.rooms[roomName]; 
//                        this.api.removeRoomMetadata(roomName);
//                    } else {
//                        this.api.setRoomMetadata(
//                            roomName, 
//                            Object.keys(clients).length
//                        );
//                    }
//                });
//
//            })
//        });
//    }
//
//    private handleGarbagePickedUp(
//        clientId: string, room: RoomInterface 
//    ): void {
//        room.clients[clientId].garbage = room.gameState.garbage;
//        room.clients[clientId].correctAnswer = "";
//        room.gameState.garbage.initializeGarbage();
//    }
//
//    private handleGarbageThrownOut(
//        clientId: string,
//        response: GarbageThrownOutInterface,
//        room: RoomInterface
//    ): void {
//        if (response.trashCanType === room.clients[clientId]?.garbage?.type) {
//            ++room.clients[clientId].score;
//            room.clients[clientId].garbage.setCorrectAnswer();
//        } else {
//            const type = room.clients[clientId]?.garbage?.type;
//            room.clients[clientId].correctAnswer = type ?? "";
//            room.clients[clientId].garbage.setIncorrectAnswer();
//        }
//    }
//
//    private setInitialGameState(room: RoomInterface): void {
//        room.gameState.status = "inactive";
//        Object.entries(room.clients).forEach(([_, client]) => {
//            client.ready = false;
//            client.position = [0, 0, 0];
//            client.garbage = new Garbage(false);
//        });
//    }
//
//    public startTimer(room: RoomInterface): void {
//        if (!room.timer) {
//            room.timer = setInterval(() => {
//                this.updateTimer(room);
//            }, SECOND_IN_MILI);
//        }
//    }
//
//    public startTickRateTimer(
//        socket: MySocket, 
//        room: RoomInterface
//    ): NodeJS.Timeout {
//        return setInterval(() => {
//            this.tick(socket, room);
//        }, TICK_RATE_MS);
//    }
//
//    private updateTimer(room: RoomInterface): void {
//        room.gameState.timeLeft--;
//        if (room.gameState.timeLeft < 0) {
//            room.gameState.timeLeft = GAME_DURATION;
//            clearInterval(room.timer);
//            room.timer = undefined;
//            this.setInitialGameState(room);
//        }
//    }
//
//    private async tick(socket: MySocket, room: RoomInterface) {
//        if (Object.keys(room.clients).length) {
//            socket.emit(
//                "updateClients", 
//                room.clients, 
//                (position: [number,number,number]) => {
//                    if (position instanceof Array) {
//                        room.clients[socket.id].position = position;
//                    }
//                }
//            );
//            this.io.to(room.name).emit("updateGameState", room.gameState);
//        }
//    }
//}
