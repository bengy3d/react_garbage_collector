import { useBox, Triplet, useSphere } from '@react-three/cannon';
import { useFrame, useLoader } from '@react-three/fiber';
import React, {useRef} from 'react';
import { BufferGeometry, Mesh } from 'three';
import { useControls } from '../useControls';

export const Player = () => {
    const position: Triplet = [-1.5, 3, 3]

    const width = 0.7;
    const height = 30;
    const front = 30;
    const chassisBodyArgs: Triplet = [width, height, front];

    const [chassisBody, chassisApi] = useSphere(
        () => ({
            args: [0.7],
            mass: 5,
            position,
        }),
        useRef(null),
    );

    useControls({chassisBody, chassisApi});

    return (
        <mesh ref={chassisBody as React.RefObject<Mesh<BufferGeometry>>}>
            <meshBasicMaterial color="green" opacity={0.3} />
            <sphereGeometry args={chassisBodyArgs} />
        </mesh>
    );
}