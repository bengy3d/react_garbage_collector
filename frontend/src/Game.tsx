import { Physics, Triplet } from "@react-three/cannon";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./Scene";
import { Gui } from "./Components/GameInterface/Gui";
import { Plane } from "./Models/Plane";
import { Player } from "./Models/Player";
import { Garbage } from "./Models/Garbage";
import { Floor } from "./Models/Floor";
import { Cubicle } from "./Models/Cubicle";
import { TrashCan } from "./Models/TrashCan";
import { DESK_MAP, GARBAGE_TYPES } from "./constants";
import { useSocketConnection } from "./Hooks/useSocketConnection";
import { OtherPlayer } from "./Models/OtherPlayer";
import { SocketClient } from "./SocketClient";
import { styled } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const Root = styled('div')({
    width: '100%',
    height: '100%',
})

export const Game = () => {
    const navigate = useNavigate();
    const location = useLocation();

    if (!location?.state?.roomName) {
        navigate("/");
    }

    const {
        clients,
        numOfReadyClients,
        gameState,
        playerState,
        playerStateRef,
        setPlayerId,
        playerPositionRef
    } = useSocketConnection({roomName: location?.state?.roomName});

    return (
        <Root>
            <Canvas>
                <Physics>
                    <Scene />
                    <Floor />
                    {DESK_MAP.map((position, index) => (
                        <Cubicle key={index} position={position as Triplet} />
                    ))}
                    <Plane />
                    <Player
                        setPlayerId={setPlayerId}
                        gameStatus={gameState.status}
                        playerPositionRef={playerPositionRef}
                        color={playerStateRef.current.color}
                    />
                    {Object.keys(clients)
                        .filter((clientKey) => clientKey !== SocketClient.id)
                        .map((client) => (
                            <OtherPlayer
                                key={client}
                                clientId={client}
                                position={clients[client].position}
                                color={clients[client].color}
                            />
                        ))}
                    {gameState.garbage?.location && (
                        <Garbage
                            location={gameState.garbage.location}
                            gameStatus={gameState.status}
                            playerState={playerStateRef}
                        />
                    )}
                    {GARBAGE_TYPES.map((t) => (
                        <TrashCan
                            gameStatus={gameState.status}
                            key={t.type}
                            playerState={playerStateRef}
                            position={t.pos as Triplet}
                            type={t.type}
                        />
                    ))}
                </Physics>
            </Canvas>
            <Gui
                gameState={gameState}
                correctAnswer={playerState.correctAnswer}
                score={playerState.score}
                garbage={playerState.garbage}
                clients={clients}
                numOfReadyClients={numOfReadyClients}
            />
        </Root>
    );
};
