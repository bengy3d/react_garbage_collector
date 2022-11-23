import React from "react";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./Scene";
import { Physics } from "@react-three/cannon";
import { Plane } from "./Models/Plane";
import { Player } from "./Models/Player";

function App() {
  return (
    <Canvas>
      <Physics>
        <Scene />
        <Plane />
        <Player />
      </Physics>
    </Canvas>
  );
}

export default App;
