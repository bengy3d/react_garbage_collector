import express from "express";
import { RoomMetadataObjectInterface } from "./Interfaces/RoomMetadataInterface";

export class ApiServer {
    private app: express.Application;
    private roomsMetadata: RoomMetadataObjectInterface;

    constructor(app: express.Application) {
        this.roomsMetadata = {};
        this.app = app;
        this.app.listen(process.env.API_PORT);
        this.setUpEndpoints();
    }
    
    private setUpEndpoints() {
        this.app.get("/rooms", (_, res) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.json(this.roomsMetadata);
        });
    }

    public setRoomMetadata(roomName: string, clientCount: number) {
        if (!this.roomsMetadata[roomName]) {
            this.roomsMetadata[roomName] = {
                name: roomName,
                numOfClients: clientCount
            }
        } else {
            this.roomsMetadata[roomName].numOfClients = clientCount;
        }
    }

    public removeRoomMetadata(roomName: string) {
        delete this.roomsMetadata[roomName];
    }

}
