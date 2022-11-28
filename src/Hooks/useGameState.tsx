import React, { useState, useRef } from "react";
import { PlayerStateInterface } from "../Interfaces/PlayerStateInterace";
import garbageData from "../Resources/garbageData.json";

const initialGarbage = {
    type: "",
    description: "",
    imageName: "DEFAULT",
};

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
            garbage: {
                description: garbage.name,
                type: garbage.type,
                imageName: garbage.imgName,
            },
        }));
        playerStateRef.current.garbage.type = garbage.type;
        playerStateRef.current.garbage.description = garbage.name;
        playerStateRef.current.garbage.imageName = garbage.imgName;
    };

    const increaseScore = () => {
        setPlayerState((prev) => ({
            ...prev,
            garbage: initialGarbage,
            score: prev.score + 1,
        }));
        playerStateRef.current.score = playerStateRef.current.score + 1;
        playerStateRef.current.garbage.type = "";
        playerStateRef.current.garbage.description = "";
        playerStateRef.current.garbage.imageName = "DEFAULT";
    };

    return {
        playerState,
        playerStateRef,
        stateFunctions: {
            setPlayerId,
            setPlayerGarbage,
            increaseScore,
        },
    };
};
