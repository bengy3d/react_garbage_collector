import { Triplet } from "@react-three/cannon";
import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { SocketClient } from "../SocketClient";

interface MoveInterface {
    id: string;
    position?: number[];
}

interface ClientInterface {
    id: string;
    position: [number, number, number];
}

interface ClientArrayInterface {
    [value: string]: ClientInterface;
};

interface ServerToClientEvents {
    move: (clients: ClientArrayInterface) => void;
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
    move: (movement: MoveInterface) => void;
    hello: () => void;
}

export interface SocketIO
    extends Socket<ServerToClientEvents, ClientToServerEvents> {
    id: string;
}

export type MySocket = SocketIO;

export const useSocketConnection = () => {
    const [clients, setClients] = useState<ClientArrayInterface>({});

    useEffect(() => {
        SocketClient.connect();
        SocketClient.on("move", (clients: ClientArrayInterface) => {
            setClients(clients);
        });
        // Dispose gracefuly
        return () => {
            SocketClient.disconnect();
        };
    }, []);

    return {
        clients: clients,
    };
};
