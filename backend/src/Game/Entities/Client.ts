import { ClientInterface } from "../../Interfaces/ClientInterface";
import { GarbageInterface } from "../../Interfaces/GarbageInterface";
import { GarbageThrownOutInterface } from "../../Interfaces/GarbageThrownOutInterface";
import { MySocket } from "../../Interfaces/MySocketInterface";
import Garbage from "./Garbage";

export default class Client implements ClientInterface {
    id: string;
    position: [number, number, number];
    ready: boolean;
    score: number;
    color: string;
    correctAnswer: string;
    garbage: Garbage;
    playerId?: string;

    private socket: MySocket;

    constructor(
        color: string, 
        socket: MySocket,
        readyCallback: () => void,
        getGarbageAndInitNew:  () => Garbage
    ) {
        this.id = socket.id;
        this.position = [0, 0, 0];
        this.ready = false;
        this.score = 0;
        this.color = color;
        this.garbage = new Garbage(false);
        this.correctAnswer = "";
        this.socket = socket;
        this.startListeners(readyCallback, getGarbageAndInitNew);
    }

    public startListeners(
        readyCallback: () => void,
        getGarbageAndInitNew:  () => Garbage
    ) {
        this.listenForSetPlayerId();
        this.listenForReadyAction(readyCallback);
        this.listenForGarbageThrownOut();
        this.listenForGarbagePickedUp(getGarbageAndInitNew);
    }

    private listenForReadyAction(readyCallback: () => void) {
        this.socket.on("ready", () => {
            this.ready = true;
            this.score = 0;
            readyCallback();
        });
    }

    private listenForSetPlayerId() {
        this.socket.on("setPlayerId", (playerId: string) => {
            console.log("setting playerId to %s", playerId);
            this.playerId = playerId;
        })
    }

    private listenForGarbagePickedUp(
        getGarbageAndInitNew: () => Garbage
    ) {
        this.socket.on("garbagePickedUp", () => {
            console.info("garbage was picked up");
            this.setGarbage(getGarbageAndInitNew());
        });
    }

    private listenForGarbageThrownOut() {
        this.socket.on(
            "garbageThrownOut",
            (response: GarbageThrownOutInterface) => {
                if (response.trashCanType === this.garbage.type) {
                    this.incrementScore();
                } else {
                    this.setIncorrectAnswer();                
                }
            }
        );
    }

    public resetGameState() {
        this.ready = false;
        this.position = [0, 0, 0];
        this.garbage = new Garbage(false);
    }

    public incrementScore() {
        ++this.score;
        this.garbage.setCorrectAnswer();
    }

    public setIncorrectAnswer() {
        this.correctAnswer = this.garbage.type;
        this.garbage.setIncorrectAnswer();
    }

    public setGarbage(garbage: GarbageInterface) {
        this.garbage = garbage;
        this.correctAnswer = "";
    }

    public getSocket(): MySocket {
        return this.socket;
    }

    toJSON() {
        return {
            id: this.id,
            playerId: this.playerId,
            position: this.position,
            ready: this.ready,
            score: this.score,
            color: this.color,
            garbage: this.garbage,
            correctAnswer: this.correctAnswer,
        }
    }
}
