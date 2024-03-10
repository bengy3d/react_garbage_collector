export interface RoomMetadataInterface {
    name: string;
    numOfClients: number;
}

export interface RoomMetadataObjectInterface {
    [value: string]: RoomMetadataInterface;
}
