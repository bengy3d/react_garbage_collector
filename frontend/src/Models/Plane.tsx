import { usePlane } from '@react-three/cannon';
import React, { useRef } from 'react';


export const Plane = () => {
    const [ref] = usePlane(
        () => ({
            type: 'Static',
            rotation: [-Math.PI / 2, 0, 0] 
        }),
        useRef(null),
    );
    return (
        <mesh position={[0, 0, 0]} rotation={[- Math.PI / 2, 0, 0]} scale={[10, 10, 0]}>
            <planeGeometry />
            <meshBasicMaterial attach="material" color="grey" />
        </mesh>
    );
}
