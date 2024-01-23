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
    const [gameState, setGameState] =
        useState<GameStateInterface>(initalGameState);

    useEffect(() => {
        SocketClient.connect();

        SocketClient.on("updateClients", (response: ClientsObjectInterface) => {
            setClients(response);
            setPlayerState(response[SocketClient.id ?? 0]);
            playerStateRef.current = response[SocketClient.id ?? 0];
        });

        SocketClient.on("updateGameState", (response: GameStateInterface) => {
            setGameState(response);
        });

        SocketClient.on("ready", (response: ClientsObjectInterface) => {
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
        setPlayerId
    };
};
