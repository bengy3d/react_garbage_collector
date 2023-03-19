import express from "express";
import { createServer, Server } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { INIT_TIME_LEFT, SECOND_IN_MILI } from "./constants";

interface MySocket extends Socket {
    id: string;
}

interface ClientInterface {
    id: string;
    position: [number, number, number];
    ready: boolean;
}

interface ClientsObjectInterface {
    [value: string]: ClientInterface;
}

export default class GameServer {
    private app: express.Application;
    private server: Server;
    private io: SocketIOServer;
    private clients: ClientsObjectInterface;
    private timeLeft: number;
    private intervalId?: NodeJS.Timer;

    constructor() {
        this.app = express();
        this.server = createServer(this.app);
        this.io = new SocketIOServer(this.server, {
            cors: {
                origin: "*",
            },
        });
        this.clients = {};
        this.timeLeft = INIT_TIME_LEFT;
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
            };

            console.log("emitting");
            this.io.sockets.emit("move", this.clients);

            socket.on("move", (response: ClientInterface) => {
                this.clients[response.id].position = response.position;

                this.io.sockets.emit("move", this.clients);
            });

            socket.on("ready", () => {
                this.clients[socket.id].ready = true;
                this.io.sockets.emit("ready", this.clients);
                if (
                    Object.values(this.clients).every(
                        (client) => client.ready === true
                    )
                ) {
                    this.startTimer();
                    this.io.sockets.emit("startGame");
                }
            });

            socket.on("pause", () => {
                this.clients[socket.id].ready = false;
            });

            socket.on("disconnect", () => {
                delete this.clients[socket.id];
            });
        });
    }

    public startTimer(): void {
        this.intervalId = setInterval(() => {
            this.updateTimer();
        }, SECOND_IN_MILI);
    }

    private updateTimer(): void {
        this.timeLeft--;
        console.log(this.timeLeft);
        if (this.timeLeft === 0) {
            clearInterval(this.intervalId);
            this.io.sockets.emit("gameOver");
            console.log("gameOver");
            this.timeLeft = INIT_TIME_LEFT;
        }
    }
}
