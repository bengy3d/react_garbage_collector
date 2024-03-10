import { config } from "dotenv";
import App from "./App";

config({ path: ".env.local" });

const app = new App();
