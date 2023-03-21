import { useState, useRef, useEffect } from "react";
import { PlayerStateInterface } from "../Interfaces/PlayerStateInterace";
import { GameStateInterface } from "../Interfaces/GameStateInterface";
import { GAME_TIME } from "../constants";

const initialGarbage = {
    type: "",
    description: "",
    imageName: "DEFAULT",
};

const initialPlayerState: PlayerStateInterface = {
    playerId: null,
    garbage: initialGarbage,
    correctAnswer: "",
    score: 0,
};


export const useGameState = () => {
    const [playerState, setPlayerState] =
        useState<PlayerStateInterface>(initialPlayerState);
    //const [gameState, setGameState] =
    //    useState<GameStateInterface>(initialGameState);
    const [timer, setTimer] = useState<NodeJS.Timer>();
    const playerStateRef = useRef(playerState);
    //const gameStateRef = useRef(gameState);
    const timerRef = useRef(timer);

    const setPlayerId = (playerId?: number) => {
        setPlayerState((prev) => ({ ...prev, playerId }));
        playerStateRef.current.playerId = playerId;
    };

    const setPlayerGarbage = () => {
        //const garbageLength = garbageData.garbages.length;
        //const randIndex = Math.floor(Math.random() * garbageLength);
        //const garbage = garbageData.garbages[randIndex];
        //setPlayerState((prev) => ({
        //    ...prev,
        //    garbage: {
        //        description: garbage.name,
        //        type: garbage.type,
        //        imageName: garbage.imgName,
        //    },
        //    correctAnswer: "",
        //}));
        //playerStateRef.current.garbage.type = garbage.type;
        //playerStateRef.current.garbage.description = garbage.name;
        //playerStateRef.current.garbage.imageName = garbage.imgName;
    };

    const increaseScore = () => {
        setPlayerState((prev) => ({
            ...prev,
            garbage: initialGarbage,
            score: prev.score + 1,
        }));
        playerStateRef.current.score = playerStateRef.current.score + 1;
        resetGarbageState();
    };

    const resetGarbageState = () => {
        setPlayerState((prev) => ({
            ...prev,
            garbage: initialGarbage,
            correctAnswer: prev.garbage.type,
        }));
        playerStateRef.current.garbage.type = "";
        playerStateRef.current.garbage.description = "";
        playerStateRef.current.garbage.imageName = "DEFAULT";
    };

    // useEffect(() => {
    //     if (gameState.status === "active") {
    //         timerRef.current = setInterval(() => {
    //             if (gameStateRef.current.timeLeft === 0) {
    //                 return;
    //             }
    //             setGameState((prev) => ({
    //                 ...prev,
    //                 timeLeft: prev.timeLeft - 1,
    //             }));
    //             gameStateRef.current.timeLeft -= 1;
    //         }, 1000);
    //         setTimer(timerRef.current);
    //     }
    // }, [gameState.status]);

    const resetPlayerState = () => {
        playerStateRef.current.score = 0;
        playerStateRef.current.playerId = null;
        playerStateRef.current.correctAnswer = "";
        resetGarbageState();
        setPlayerState(initialPlayerState);
    };

    //const startGame = () => {
    //    resetPlayerState();
    //    gameStateRef.current.status = "active";
    //    gameStateRef.current.timeLeft = GAME_TIME;
    //    setGameState((prev) => ({
    //        ...prev,
    //        status: "active",
    //        timeLeft: GAME_TIME,
    //    }));
    //};

    //const endGame = () => {
    //    setGameState((prev) => ({ ...prev, status: "inactive" }));
    //    gameStateRef.current.status = "inactive";
    //    clearInterval(timerRef.current);
    //    setTimer(undefined);
    //};

    return {
        playerState,
        playerStateRef,
        stateFunctions: {
            setPlayerId,
            setPlayerGarbage,
            increaseScore,
            resetGarbageState,
        },
    };
};
