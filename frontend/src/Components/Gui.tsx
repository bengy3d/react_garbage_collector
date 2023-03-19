import { ClientArrayInterface } from "../Hooks/useSocketConnection";
import { GameStateInterface } from "../Interfaces/GameStateInterface";
import { GarbageInterface } from "../Interfaces/GarbageInterace";
import { Hud } from "./Hud";
import { Lobby } from "./Lobby";
import { Timer } from "./Timer";

interface PropsInterface {
    garbage: GarbageInterface;
    correctAnswer: string;
    score: number;
    gameState: GameStateInterface;
    startGame: () => void;
    endGame: () => void;
    clients: ClientArrayInterface;
    numOfReadyClients: number;
}

export const Gui = (props: PropsInterface) => (
    <>
        <Hud
            correctAnswer={props.correctAnswer}
            score={props.score}
            garbage={props.garbage}
        />
        {props.gameState.status === "active" && (
            <Timer timeLeft={props.gameState.timeLeft} />
        )}
        {props.gameState.status !== "active" && (
            <Lobby 
                score={props.score}
                gameStatus={props.gameState.status}
                numOfReadyClients={props.numOfReadyClients}
                clients={props.clients}
            />
        )}
    </>
);
