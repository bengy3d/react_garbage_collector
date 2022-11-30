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

const garbageTypes = [
    { type: "bioodpady", pos: [-4, 0, 8] },
    { type: "szkło", pos: [-2, 0, 8] },
    { type: "metale i tworzywa sztuczne", pos: [0, 0, 8] },
    { type: "papier", pos: [2, 0, 8] },
    { type: "odpady zmieszane", pos: [4, 0, 8] },
];

const deskMap = [
    [6, 0, 3],
    [6, 0, -2],
    [6, 0, -7],
    [3, 0, 3],
    [3, 0, -2],
    [3, 0, -7],
    [0, 0, 3],
    [0, 0, -2],
    [0, 0, -7],
    [-3, 0, 3],
    [-3, 0, -2],
    [-3, 0, -7],
    [-6, 0, 3],
    [-6, 0, -2],
    [-6, 0, -7],
]


const App = () => {
    const { playerState, playerStateRef, stateFunctions } = useGameState();

    return (
        <>
            <Canvas>
                <Physics>
                    <Scene />
                    <Floor />
                    {deskMap.map((position, index) => (
                        <Cubicle key={index} position={position as Triplet}/>
                    ))}
                    <Plane />
                    <Player setPlayerId={stateFunctions.setPlayerId} />
                    <Garbage
                        playerState={playerStateRef}
                        setPlayerGarbage={stateFunctions.setPlayerGarbage}
                        position={[-5, 0, 2]}
                    />
                    {garbageTypes.map((t) => (
                        <TrashCan
                            key={t.type}
                            playerState={playerStateRef}
                            position={t.pos as Triplet}
                            type={t.type}
                            increaseScore={stateFunctions.increaseScore}
                        />
                    ))}
                </Physics>
            </Canvas>
            <Gui score={playerState.score} garbage={playerState.garbage}/>
        </>
    );
};

export default App;
