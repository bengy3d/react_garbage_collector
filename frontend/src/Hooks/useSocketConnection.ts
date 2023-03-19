import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { SocketClient } from "../SocketClient";

interface MoveInterface {
    id: string;
    position?: number[];
}

export interface ClientInterface {
    id: string;
    position: [number, number, number];
    ready: boolean;
}

export interface ClientArrayInterface {
    [value: string]: ClientInterface;
}

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

interface PropsInterface {
    startGame: () => void;
}

export const useSocketConnection = (props: PropsInterface) => {
    const [clients, setClients] = useState<ClientArrayInterface>({});
    const [numOfReadyClients, setNumOfReadyClients] = useState<number>(0);

    useEffect(() => {
        SocketClient.connect();

        SocketClient.on("move", (response: ClientArrayInterface) => {
            setClients(response);
        });

        SocketClient.on("startGame", () => {
            props.startGame();
            setNumOfReadyClients(0);
        });

        SocketClient.on("ready", (response: ClientArrayInterface) => {
            setClients(response);
            setNumOfReadyClients(Object.values(response).reduce(
                (acc, cur) => acc + (cur.ready ? 1 : 0),
                0
            ));
        });

        return () => {
            SocketClient.disconnect();
        };
    }, []);

    return {
        clients,
        numOfReadyClients,
    };
};
