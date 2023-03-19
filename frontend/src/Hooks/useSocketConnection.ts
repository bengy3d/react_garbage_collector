import { useEffect, useState } from "react";
import { ClientsObjectInterface } from "../Interfaces/Sockets/ClientInterface";
import { SocketClient } from "../SocketClient";

interface PropsInterface {
    startGame: () => void;
    endGame: () => void;
}

export const useSocketConnection = (props: PropsInterface) => {
    const [clients, setClients] = useState<ClientsObjectInterface>({});
    const [numOfReadyClients, setNumOfReadyClients] = useState<number>(0);

    useEffect(() => {
        SocketClient.connect();

        SocketClient.on("move", (response: ClientsObjectInterface) => {
            setClients(response);
        });

        SocketClient.on("startGame", () => {
            props.startGame();
            setNumOfReadyClients(0);
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

        SocketClient.on("gameOver", () => {
            props.endGame();
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
