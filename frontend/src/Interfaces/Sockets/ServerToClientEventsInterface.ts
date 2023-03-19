import { ClientsObjectInterface } from "./ClientInterface";

export interface ServerToClientEventsInterface {
    ready: (clients: ClientsObjectInterface) => void;
    move: (clients: ClientsObjectInterface) => void;
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
}
