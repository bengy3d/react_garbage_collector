import { DESK_MAP } from "../../constants";
import { GarbageInterface } from "../../Interfaces/GarbageInterface";
import garbageData from "../../Resources/garbageData.json";

export default class Garbage implements GarbageInterface {
    description: string;
    type: string;
    imageName: string;
    location?: number[];
    thrownOut: boolean;

    constructor(init: boolean) {
        this.type = "";
        this.description = "";
        this.imageName = "DEFAULT";
        this.thrownOut = true;
        if (init) {
            this.initializeGarbage();
        }
    }

    public initializeGarbage() {
        const garbageLength = garbageData.garbages.length;
        const randIndex = Math.floor(Math.random() * garbageLength);
        const garbage = garbageData.garbages[randIndex];
        const randomDesk =
            DESK_MAP[Math.floor(Math.random() * DESK_MAP.length)];
        const nextLocation = [
            randomDesk[0] + 1.1,
            randomDesk[1] + 0.01,
            randomDesk[2] - 1,
        ];
        this.type = garbage.type;
        this.imageName = garbage.imgName;
        this.description = garbage.name;
        this.location = nextLocation;
        this.thrownOut = false;
    }

    public setCorrectAnswer() {
        this.imageName = "CORRECT-ANSWER";
        this.thrownOut = true;
    }

    public setIncorrectAnswer() {
        this.imageName = "INCORRECT-ANSWER";
        this.thrownOut = true;
    }
}
