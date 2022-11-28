import React, { useState, useRef } from "react";
import { PlayerStateInterface } from "../Interfaces/PlayerStateInterace";
import garbageData from '../Resources/garbageData.json';

const initialPlayerState: PlayerStateInterface = {
    playerId: null,
    garbage: { type: "", description: "" },
};

export const useGameState = () => {
    const [playerState, setPlayerState] =
        useState<PlayerStateInterface>(initialPlayerState);

    const playerStateRef = useRef(playerState);

    const setPlayerId = (playerId?: number) => {
        setPlayerState({ ...playerState, playerId });
        playerStateRef.current.playerId = playerId;
    };

    const setPlayerGarbage = () => {
        const garbageLength = garbageData.garbages.length;
        const randIndex = Math.floor(Math.random() * garbageLength);
        const garbage = garbageData.garbages[randIndex];
        setPlayerState({ ...playerState, garbage: {description: garbage.name, type: garbage.type }});
        playerStateRef.current.garbage.type = garbage.type;
        playerStateRef.current.garbage.description = garbage.name;
    };

    return {
        playerState,
        playerStateRef,
        setPlayerId,
        setPlayerGarbage,
    }
};
