import express from "express";
import { RoomMetadataObjectInterface } from "../Interfaces/RoomMetadataInterface";

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

    public setRoomMetadata(name: string, numOfClients: number) {
        if (!this.roomsMetadata[name]) {
            this.roomsMetadata[name] = {
                name,
                numOfClients
            }
        } else {
            this.roomsMetadata[name].numOfClients = numOfClients;
        }
    }

    public removeRoomMetadata(roomName: string) {
        delete this.roomsMetadata[roomName];
    }

}
