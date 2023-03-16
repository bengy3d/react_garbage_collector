import express from 'express';
import { createServer, Server } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';

interface MySocket extends Socket {
    id: string;
}

interface ClientInterface {
    id: string;
    position: [number, number, number];
}

interface ClientArrayInterface {
    [value: string]: ClientInterface;
};

export default class GameServer {
    private app: express.Application;
    private server: Server;
    private io: SocketIOServer;
    private clients: ClientArrayInterface;

    constructor() {
        this.app = express();
        this.server = createServer(this.app);
        this.io = new SocketIOServer(this.server, {
            cors: {
                origin: '*',
            }
        });
        this.clients = {};
        this.listen();
    }

    private listen(): void {
        this.server.listen(process.env.PORT, () => {
            console.log('Running server on port %s', process.env.PORT);
        });

        this.io.on('connect', (socket: MySocket) => {
            console.log('Connected client on port %s.', process.env.PORT);

            this.clients[socket.id] = {
                id: socket.id,
                position: [0, 0, 0],
            };

            console.log('emitting');
            this.io.sockets.emit('move', this.clients);

            socket.on('move', (response: ClientInterface) => {
                this.clients[response.id].position = response.position;
        
                this.io.sockets.emit('move', this.clients);
            })

            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });
        });
    }
}