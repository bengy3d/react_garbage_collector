import { Triplet, useSphere } from "@react-three/cannon";
import React, { useEffect, useRef } from "react";
import { BufferGeometry, Mesh } from "three";
import { useControls } from "../Hooks/useControls";
import { ClientInterface } from "../Interfaces/Sockets/ClientInterface";
import { SocketClient } from "../SocketClient";

interface PropsInterface {
    setPlayerId: (id?: number) => void;
    gameStatus: "active" | "inactive" | "notStarted" | "paused";
    playerPositionRef: React.MutableRefObject<Triplet>;
    color: string;
}

export const Player = (props: PropsInterface) => {
    const width = 0.4;
    const height = 30;
    const front = 30;
    const chassisBodyArgs: Triplet = [width, height, front];

    const position: Triplet = [-1.5, 0.4, 3];

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
        chassisApi.position.subscribe(v => {
            props.playerPositionRef.current = v;
        })
    }, []);

    useEffect(() => {
        console.log(props.color);
    }, [props.color]);

    useControls({ 
        socket: SocketClient, 
        gameStatus: props.gameStatus, 
        position: props.playerPositionRef.current, 
        chassisApi 
    });

    return (
        <mesh
            ref={chassisBody as React.RefObject<Mesh<BufferGeometry>>}
        >
            <meshBasicMaterial color={props.color} opacity={0.3} />
            <sphereGeometry args={chassisBodyArgs} />
        </mesh>
    ) 
};
