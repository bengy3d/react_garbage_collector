export interface GarbageInterface {
    description: string;
    type: string;
    imageName: string;
    location?: number[];
    thrownOut: boolean;


    initializeGarbage(): void;
    setCorrectAnswer(): void;
    setIncorrectAnswer(): void;
}
