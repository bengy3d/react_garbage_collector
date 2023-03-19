export interface ClientInterface {
    id: string;
    position: [number, number, number];
    ready: boolean;
}

export interface ClientsObjectInterface {
    [value: string]: ClientInterface;
}