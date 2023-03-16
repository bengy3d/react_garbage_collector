import React, {useState, useRef, useEffect} from 'react';
import { useControls } from "./useControls";
import { PublicApi, Triplet, useSphere } from "@react-three/cannon";
import { Object3D } from 'three';
import { MySocket } from './useSocketConnection';

interface PropsInterface {
    setPlayerId: (id?: number) => void;
    gameStatus: "active" | "inactive" | "notStarted";
    socket: MySocket
}

export interface ChassisInterface { 
    body: React.RefObject<Object3D<THREE.Event>>;
    api: PublicApi;
}

export const usePlayerControls = (props: PropsInterface): ChassisInterface => {
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


    useControls({ socket: props.socket, gameStatus: props.gameStatus, chassisApi });

    return {
        api: chassisApi,
        body: chassisBody
    }
}