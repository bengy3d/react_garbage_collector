import express from "express";
import { createServer, Server } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import {
    ClientInterface,
    ClientsObjectInterface,
} from "./Interfaces/ClientInterface";
import { GarbageThrownOutInterface } from "./Interfaces/GarbageThrownOutInterface";
import { MySocket } from "./Interfaces/MySocketInterface";
import garbageData from "./Resources/garbageData.json";
import { DESK_MAP, INIT_TIME_LEFT, SECOND_IN_MILI, TICK_RATE_MS } from "./constants";
import { GarbageInterface } from "./Interfaces/GarbageInterface";

const initialGarbage = {
    type: "",
    description: "",
    imageName: "DEFAULT",
};

export interface GameStateInterface {
    status: "active" | "inactive" | "notStarted" | "paused";
    garbage: GarbageInterface;
    timeLeft: number;
}

export default class GameServer {
    private app: express.Application;
    private server: Server;
    private io: SocketIOServer;
    private clients: ClientsObjectInterface;
    private gameState: GameStateInterface;
    private intervalId?: NodeJS.Timeout;

    constructor() {
        this.app = express();
        this.server = createServer(this.app);
        this.io = new SocketIOServer(this.server, {
            cors: {
                origin: "*",
            },
        });
        this.clients = {};
        this.gameState = {
            status: "notStarted",
            garbage: this.getRandomGarbageAndLocation(),
            timeLeft: INIT_TIME_LEFT,
        };
        this.listen();
    }

    private listen(): void {
        this.server.listen(process.env.PORT, () => {
            console.log("Running server on port %s", process.env.PORT);
        });

        this.io.on("connect", (socket: MySocket) => {
            console.log("Connected client on port %s.", process.env.PORT);

            this.clients[socket.id] = {
                id: socket.id,
                position: [0, 0, 0],
                ready: false,
                score: 0,
                garbage: initialGarbage,
                correctAnswer: "",
            };
            const tick = this.startTickRateTimer(socket);

            this.io.sockets.emit("updateGameState", this.gameState);
            this.io.sockets.emit("updateClients", this.clients);

            socket.on("setPlayerId", (response: string) => {
                this.clients[socket.id].playerId = response;
            })

            socket.on("garbagePickedUp", () =>
                this.handleGarbagePickedUp(socket)
            );

            socket.on(
                "garbageThrownOut",
                (response: GarbageThrownOutInterface) =>
                    this.handleGarbageThrownOut(socket, response)
            );

            socket.on("ready", () => {
                this.clients[socket.id].ready = true;
                this.io.sockets.emit("ready", this.clients);
                if (
                    Object.values(this.clients).every(
                        (client) => client.ready === true
                    )
                ) {
                    this.startTimer();
                    this.gameState.status = "active";
                    this.io.sockets.emit("updateGameState", this.gameState);
                }
            });

            socket.on("pause", () => {
                this.clients[socket.id].ready = false;
                this.gameState.status = "paused";
            });

            socket.on("disconnect", () => {
                clearInterval(tick);
                delete this.clients[socket.id];
            });
        });
    }

    private handleGarbagePickedUp(socket: MySocket): void {
        this.clients[socket.id].garbage = this.gameState.garbage;
        this.clients[socket.id].correctAnswer = "";
        this.gameState.garbage = this.getRandomGarbageAndLocation();
        socket.emit("updateGameState", this.gameState);
        this.io.sockets.emit("updateClients", this.clients);
    }

    private handleGarbageThrownOut(
        socket: MySocket,
        response: GarbageThrownOutInterface
    ): void {
        if (response.trashCanType === this.clients[socket.id]?.garbage?.type) {
            ++this.clients[socket.id].score;
            this.clients[socket.id].garbage = initialGarbage;
        } else {
            const type = this.clients[socket.id]?.garbage?.type;
            this.clients[socket.id].correctAnswer = type ?? "";
            this.clients[socket.id].garbage = initialGarbage;
        }
    }

    private setInitialGameState(): void {
        this.gameState.status = "inactive";
        Object.entries(this.clients).forEach(([key, client]) => {
            client.ready = false;
            client.position = [0, 0, 0];
            client.garbage = initialGarbage;
        });
        this.io.sockets.emit("updateGameState", this.gameState);
        this.io.sockets.emit("updateClients", this.clients);
    }

    private getRandomGarbageAndLocation(): GarbageInterface {
        const garbageLength = garbageData.garbages.length;
        const randIndex = Math.floor(Math.random() * garbageLength);
        const garbage = garbageData.garbages[randIndex];
        const randomDesk =
            DESK_MAP[Math.floor(Math.random() * DESK_MAP.length)];
        const next = [
            randomDesk[0] + 1.1,
            randomDesk[1] + 0.01,
            randomDesk[2] - 1,
        ];
        return {
            type: garbage.type,
            imageName: garbage.imgName,
            description: garbage.name,
            location: next,
        };
    }

    public startTimer(): void {
        this.intervalId = setInterval(() => {
            this.updateTimer();
        }, SECOND_IN_MILI);
    }

    public startTickRateTimer(socket: MySocket): NodeJS.Timeout {
        return setInterval(() => {
            this.tick(socket);
        }, TICK_RATE_MS);
    }

    private updateTimer(): void {
        this.gameState.timeLeft--;
        if (this.gameState.timeLeft < 0) {
            this.gameState.timeLeft = INIT_TIME_LEFT;
            clearInterval(this.intervalId);
            this.setInitialGameState();
        }
    }

    private async tick(socket: MySocket) {
        if (Object.keys(this.clients).length) {
            socket.emit("updateClients", this.clients, (position: [number,number,number]) => {
                this.clients[socket.id].position = position;
            });
            this.io.sockets.emit("updateGameState", this.gameState);
        }
    }
}
