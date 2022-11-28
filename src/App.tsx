import React, { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./Scene";
import { Physics } from "@react-three/cannon";
import { Plane } from "./Models/Plane";
import { Player } from "./Models/Player";
import { Garbage } from "./Models/Garbage";
import { Floor } from "./Models/Floor";
import { Cubicle } from "./Models/Cubicle";
import { useGameState } from "./Hooks/useGameState";
import { TrashCan } from "./Models/TrashCan";

const App = () => {
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
                <TrashCan type="papier" position={[-4, 0, 8]} />
                <TrashCan type="bioodpady" position={[-2, 0, 8]} />
                <TrashCan type="metale i tworzywa sztuczne" position={[0, 0, 8]} />
                <TrashCan type="szkło" position={[2, 0, 8]} />
                <TrashCan type="odpady zmieszane" position={[4, 0, 8]} />
            </Physics>
        </Canvas>
    );
}

export default App;
