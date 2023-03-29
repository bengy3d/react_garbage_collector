import { Triplet, useSphere } from "@react-three/cannon";
import React, { useEffect, useRef } from "react";
import { BufferGeometry, Mesh } from "three";
import { useControls } from "../Hooks/useControls";
import { SocketClient } from "../SocketClient";

interface PropsInterface {
    setPlayerId: (id?: number) => void;
    gameStatus: "active" | "inactive" | "notStarted" | "paused";
}

export const Player = (props: PropsInterface) => {
    const width = 0.4;
    const height = 30;
    const front = 30;
    const chassisBodyArgs: Triplet = [width, height, front];

    const position: Triplet = [-1.5, 0.4, 3];
    const positionRef = useRef<[number, number, number]>(position);

    const [chassisBody, chassisApi] = useSphere(
        () => ({
            args: [0.4],
            mass: 5,
            position,
        }),
        useRef(null)
    );

    useEffect(() => {
        props.setPlayerId(chassisBody.current?.id);
        chassisApi.position.set(position[0],position[1],position[2]);
    }, [props.gameStatus]);

    useEffect(() => {
        chassisApi.position.subscribe(v => positionRef.current = v)
    }, []);

    useControls({ socket: SocketClient, gameStatus: props.gameStatus, position: positionRef.current, chassisApi });

    return (
        <mesh
            ref={chassisBody as React.RefObject<Mesh<BufferGeometry>>}
        >
            <meshBasicMaterial color="grey" opacity={0.3} />
            <sphereGeometry args={chassisBodyArgs} />
        </mesh>
    ) 
};
