import { Physics, Triplet } from "@react-three/cannon";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./Scene";
import { Gui } from "./Components/Gui";
import { useGameState } from "./Hooks/useGameState";
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

const App = () => {
    const { playerState, playerStateRef, gameState, stateFunctions } =
        useGameState();

    const { clients } = useSocketConnection();

    return (
        <>
            <Canvas>
                <Physics>
                    <Scene />
                    <Floor />
                    {DESK_MAP.map((position, index) => (
                        <Cubicle key={index} position={position as Triplet} />
                    ))}
                    <Plane />
                    <Player
                        setPlayerId={stateFunctions.setPlayerId}
                        gameStatus={gameState.status}
                    />
                    {Object.keys(clients)
                        .filter((clientKey) => clientKey !== SocketClient.id)
                        .map((client) => (
                            <OtherPlayer
                                key={client}
                                clientId={client}
                                position={clients[client].position}
                            />
                        ))}
                    <Garbage
                        gameStatus={gameState.status}
                        playerState={playerStateRef}
                        setPlayerGarbage={stateFunctions.setPlayerGarbage}
                    />
                    {GARBAGE_TYPES.map((t) => (
                        <TrashCan
                            gameStatus={gameState.status}
                            key={t.type}
                            playerState={playerStateRef}
                            position={t.pos as Triplet}
                            type={t.type}
                            increaseScore={stateFunctions.increaseScore}
                            resetGarbageState={stateFunctions.resetGarbageState}
                        />
                    ))}
                </Physics>
            </Canvas>
            <Gui
                gameState={gameState}
                startGame={stateFunctions.startGame}
                endGame={stateFunctions.endGame}
                correctAnswer={playerState.correctAnswer}
                score={playerState.score}
                garbage={playerState.garbage}
            />
        </>
    );
};

export default App;
