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


const initialPlayerState = {
    playerId: null,
};

function App() {
    const [playerState, setPlayerState] =
        useState<PlayerStateInterface>(initialPlayerState);
    
    const playerStateRef = useRef(playerState);

    const setPlayerId = (playerId?: number) => {
        setPlayerState({ ...playerState, playerId });
        playerStateRef.current.playerId = playerId;
    };

    return (
        <Canvas>
            <Physics>
                <Scene />
                <Floor />
                <Cubicle />
                <Plane />
                <Player setPlayerId={setPlayerId} />
                <Garbage playerState={playerStateRef} />
            </Physics>
        </Canvas>
    );
}

export default App;
