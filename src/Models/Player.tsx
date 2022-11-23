import { useBox, Triplet } from '@react-three/cannon';
import { useFrame, useLoader } from '@react-three/fiber';
import React, {useRef} from 'react';
import { BufferGeometry, Mesh } from 'three';

export const Player = () => {
    const position: Triplet = [-1.5, 3, 3]

    const width = 1;
    const height = 1;
    const front = 1;
    const chassisBodyArgs: Triplet = [width, height, front * 2];

    const [chassisBody, chassisApi] = useBox(
        () => ({
            args: chassisBodyArgs,
            mass: 150,
            position,
        }),
        useRef(null),
    );

    return (
        <mesh ref={chassisBody as React.RefObject<Mesh<BufferGeometry>>}>
            <meshBasicMaterial color="green" opacity={0.3} />
            <boxGeometry args={chassisBodyArgs} />
        </mesh>
    );
}