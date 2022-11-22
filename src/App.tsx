import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Scene } from './Scene';
import { Plane } from './Models/Plane';

function App() {
    return (
        <Canvas>
            <Scene />
            <Plane />

        </Canvas>
    );
}

export default App;
