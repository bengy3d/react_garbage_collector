import { Triplet, useSphere } from "@react-three/cannon";
import React, { useEffect, useRef } from "react";
import { BufferGeometry, Mesh } from "three";
import { useControls } from "../Hooks/useControls";

interface PropsInterface {
    setPlayerId: (id?: number) => void;
}

export const Player = (props: PropsInterface) => {
    const position: Triplet = [-1.5, 0.4, 3];

    const width = 0.4;
    const height = 30;
    const front = 30;
    const chassisBodyArgs: Triplet = [width, height, front];

    const [chassisBody, chassisApi] = useSphere(
        () => ({
            args: [width],
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
            <meshBasicMaterial color="grey" opacity={0.3} />
            <sphereGeometry args={chassisBodyArgs} />
        </mesh>
    );
};
