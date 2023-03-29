import { Triplet } from "@react-three/cannon";

export interface GarbageInterface {
    description: string;
    type: string;
    imageName: string;
    location?: Triplet;
}