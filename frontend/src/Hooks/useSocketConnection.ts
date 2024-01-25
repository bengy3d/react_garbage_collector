import { Triplet } from "@react-three/cannon";
import { useEffect, useRef, useState } from "react";
import { GameStateInterface } from "../Interfaces/GameStateInterface";
import { ClientInterface, ClientsObjectInterface } from "../Interfaces/Sockets/ClientInterface";
import { SocketClient } from "../SocketClient";

const initalGameState: GameStateInterface = {
    status: "notStarted",
    timeLeft: 120,
}

const initialGarbage = {
    type: "",
    description: "",
    imageName: "DEFAULT",
};

const initialPlayerState: ClientInterface = {
    garbage: initialGarbage,
    correctAnswer: "",
    score: 0,
    position: [0, 0, 0],
    ready: false
};

export const useSocketConnection = () => {
    const [clients, setClients] = useState<ClientsObjectInterface>({});
    const [numOfReadyClients, setNumOfReadyClients] = useState<number>(0);
    const [playerState, setPlayerState] = useState<ClientInterface>(initialPlayerState);
    const playerStateRef = useRef(playerState);
    const playerPositionRef = useRef<[number, number, number]>([0,0,0]);
    const [gameState, setGameState] =
        useState<GameStateInterface>(initalGameState);

    useEffect(() => {
        SocketClient.connect();

        SocketClient.on("updateClients", (
            data: ClientsObjectInterface,
            callbackFn: (position: [number, number, number]) => void
        ) => {
            setClients(data);
            setPlayerState(data[SocketClient.id ?? 0]);
            playerStateRef.current = data[SocketClient.id ?? 0];
            playerStateRef.current.position = playerPositionRef.current;
            if (callbackFn) {
                callbackFn(playerPositionRef.current);
            }
        });

        SocketClient.on("updateGameState", (data: GameStateInterface) => {
            setGameState(data);
        });

        SocketClient.on("ready", (response: ClientsObjectInterface) => {
            console.log(SocketClient.id)
            setClients(response);
            setNumOfReadyClients(
                Object.values(response).reduce(
                    (acc, cur) => acc + (cur.ready ? 1 : 0),
                    0
                )
            );
        });

        return () => {
            SocketClient.disconnect();
        };
    }, []);

    const setPlayerId = (playerId?: number) => {
        SocketClient.emit("setPlayerId", playerId)
    };

    return {
        playerState,
        playerStateRef,
        clients,
        numOfReadyClients,
        gameState,
        setPlayerId,
        playerPositionRef
    };
};
