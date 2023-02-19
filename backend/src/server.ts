import { config } from "dotenv";
import GameServer from "./GameServer";

config({ path: ".env.local" });

const gameServer = new GameServer();
