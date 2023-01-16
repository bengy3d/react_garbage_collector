import { Physics, Triplet } from "@react-three/cannon";
import { Canvas } from "@react-three/fiber";
import React from "react";
import { Scene } from "./Scene";
import { Gui } from "./Components/Gui";
import { useGameState } from "./Hooks/useGameState";
import { Plane } from "./Models/Plane";
import { Player } from "./Models/Player";
import { Garbage } from "./Models/Garbage";
import { Floor } from "./Models/Floor";
import { Cubicle } from "./Models/Cubicle";
import { TrashCan } from "./Models/TrashCan";
import { deskMap, garbageTypes } from "./constants";

const App = () => {
    const { playerState, playerStateRef, stateFunctions } = useGameState();

    return (
        <>
            <Canvas>
                <Physics>
                    <Scene />
                    <Floor />
                    {deskMap.map((position, index) => (
                        <Cubicle key={index} position={position as Triplet} />
                    ))}
                    <Plane />
                    <Player setPlayerId={stateFunctions.setPlayerId} />
                    <Garbage
                        playerState={playerStateRef}
                        setPlayerGarbage={stateFunctions.setPlayerGarbage}
                    />
                    {garbageTypes.map((t) => (
                        <TrashCan
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
                correctAnswer={playerState.correctAnswer}
                score={playerState.score}
                garbage={playerState.garbage}
            />
        </>
    );
};

export default App;
