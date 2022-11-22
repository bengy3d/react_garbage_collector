import React from 'react';


export const Plane = () => {
    return (
        <mesh position={[0, 0, 0]} rotation={[- Math.PI / 2, 0, 0]} scale={[10, 10, 0]}>
            <planeBufferGeometry />
            <meshBasicMaterial attach="material" color="grey" />
        </mesh>
    );
}