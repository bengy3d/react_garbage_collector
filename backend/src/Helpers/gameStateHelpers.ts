import { DESK_MAP } from "../constants";
import { GarbageInterface } from "../Interfaces/GarbageInterface";
import garbageData from "../Resources/garbageData.json";

export const getRandomGarbageAndLocation = (): GarbageInterface => {
    const garbageLength = garbageData.garbages.length;
    const randIndex = Math.floor(Math.random() * garbageLength);
    const garbage = garbageData.garbages[randIndex];
    const randomDesk =
        DESK_MAP[Math.floor(Math.random() * DESK_MAP.length)];
    const next = [
        randomDesk[0] + 1.1,
        randomDesk[1] + 0.01,
        randomDesk[2] - 1,
    ];
    return {
        type: garbage.type,
        imageName: garbage.imgName,
        description: garbage.name,
        location: next,
    };
}
