import { Triplet, useSphere } from "@react-three/cannon";
import React, { useEffect, useRef } from "react";
import { BufferGeometry, Mesh } from "three";
import { useControls } from "../useControls";

interface PropsInterface {
    setPlayerId: (id?: number) => void;
}

export const Player = (props: PropsInterface) => {
    const position: Triplet = [-1.5, 3, 3];

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
        useRef(null)
    );

    useEffect(() => {
        props.setPlayerId(chassisBody.current?.id);
    }, []);

    useControls({ chassisBody, chassisApi });

    return (
        <mesh ref={chassisBody as React.RefObject<Mesh<BufferGeometry>>}>
            <meshBasicMaterial color="green" opacity={0.3} />
            <sphereGeometry args={chassisBodyArgs} />
        </mesh>
    );
};
