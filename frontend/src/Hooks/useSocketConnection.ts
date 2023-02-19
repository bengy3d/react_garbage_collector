import React, { useEffect, useState } from "react";
import { io, Socket } from 'socket.io-client';

export interface ServerToClientEvents {
    move: (clients: number) => void;
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
}

export interface ClientToServerEvents {
    hello: () => void;
}
  
export interface InterServerEvents {
    ping: () => void;
}
  
export interface SocketData {
    name: string;
    age: number;
}

export const useSocketConnection = () => {
    const [socketClient, setSocketClient] = useState<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
    const [clients, setClients] = useState({});

    useEffect(() => {
        // On mount initialize the socket connection
        setSocketClient(io(process.env.REACT_APP_SOCKET_SERVER as string));

        // Dispose gracefuly
        return () => {
            if (socketClient) socketClient.disconnect();
        };
    }, []);

    useEffect(() => {
        if (socketClient) {
            socketClient.on("move", (clients) => {
                setClients(clients);
            });
        }
    }, [socketClient]);
}