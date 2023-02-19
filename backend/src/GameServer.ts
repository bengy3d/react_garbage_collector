import express from 'express';
import { createServer, Server } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';

export default class GameServer {
    private app: express.Application;
    private server: Server;
    private io: SocketIOServer;

    constructor() {
        this.app = express();
        this.server = createServer(this.app);
        this.io = new SocketIOServer(this.server);
        this.listen();
    }

    private listen(): void {
        this.server.listen(3001, () => {
            console.log('Running server on port %s', 3001);
        });

        this.io.on('connect', (socket: Socket) => {
            console.log('Connected client on port %s.', 3001);

            socket.on('message', (m: string) => {
                console.log('[server](message): %s', m);
                this.io.emit('message', m);
            });

            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });
        });
    }
}