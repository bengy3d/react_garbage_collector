import React, { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./Scene";
import { Physics } from "@react-three/cannon";
import { Plane } from "./Models/Plane";
import { Player } from "./Models/Player";
import { Garbage } from "./Models/Garbage";
import { Floor } from "./Models/Floor";
import { Cubicle } from "./Models/Cubicle";
import { PlayerStateInterface } from "./Interfaces/PlayerStateInterace";
import { GarbageInterface } from "./Interfaces/GarbageInterace";
import { useGameState } from "./Hooks/useGameState";

const initialPlayerState: PlayerStateInterface = {
    playerId: null,
    garbage: { type: "", description: "" },
};

function App() {
    const {playerState, playerStateRef, setPlayerId, setPlayerGarbage} = useGameState();

    return (
        <Canvas>
            <Physics>
                <Scene />
                <Floor />
                <Cubicle position={[4, 0, 3]} />
                <Plane />
                <Player setPlayerId={setPlayerId} />
                <Garbage playerState={playerStateRef} setPlayerGarbage={setPlayerGarbage} />
            </Physics>
        </Canvas>
    );
}

export default App;
