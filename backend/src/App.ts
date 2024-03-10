import express from "express";
import { ApiServer } from "./ApiServer";
import GameServer from "./GameServer";

export default class App {
    private app: express.Application;
    private gameServer: GameServer;
    private apiServer: ApiServer;

    constructor() {
        this.app = express();
        this.apiServer = new ApiServer(this.app);
        this.gameServer = new GameServer(this.app, this.apiServer);
    }
}
