import express from "express";
import { ApiServer } from "./Api/ApiServer";
import NewGameServer from "./Game/NewGameServer";

export default class App {
    private app: express.Application;
    private gameServer: NewGameServer;
    private apiServer: ApiServer;

    constructor() {
        this.app = express();
        this.apiServer = new ApiServer(this.app);
        this.gameServer = new NewGameServer(this.app, this.apiServer);
    }
}
