import React, { useState, useRef } from "react";
import { PlayerStateInterface } from "../Interfaces/PlayerStateInterace";
import garbageData from "../Resources/garbageData.json";

const initialGarbage = {
    type: "", 
    description: "" 
}

const initialPlayerState: PlayerStateInterface = {
    playerId: null,
    garbage: initialGarbage,
    score: 0,
};

export const useGameState = () => {
    const [playerState, setPlayerState] =
        useState<PlayerStateInterface>(initialPlayerState);

    const playerStateRef = useRef(playerState);

    const setPlayerId = (playerId?: number) => {
        setPlayerState((prev) => ({ ...prev, playerId }));
        playerStateRef.current.playerId = playerId;
    };

    const setPlayerGarbage = () => {
        const garbageLength = garbageData.garbages.length;
        const randIndex = Math.floor(Math.random() * garbageLength);
        const garbage = garbageData.garbages[randIndex];
        setPlayerState((prev) => ({
            ...prev,
            garbage: { description: garbage.name, type: garbage.type },
        }));
        playerStateRef.current.garbage.type = garbage.type;
        playerStateRef.current.garbage.description = garbage.name;
    };

    const increaseScore = () => {
        setPlayerState((prev) => ({ ...prev, garbage: initialGarbage, score: prev.score + 1 }));
        playerStateRef.current.score = playerStateRef.current.score + 1;
        playerStateRef.current.garbage.type = '';
        playerStateRef.current.garbage.description = '';
    };

    return {
        playerState,
        playerStateRef,
        stateFunctions: {
            setPlayerId,
            setPlayerGarbage,
            increaseScore,
        }
    };
};
