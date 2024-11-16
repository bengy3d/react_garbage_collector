import { PublicApi } from "@react-three/cannon";
import React, { useEffect, useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MySocket } from "../Interfaces/Sockets/SocketIOInterface";
import { MOVEMENT_SPEED } from "../constants";

interface StateInterface {
    [value: string]: boolean;
}

interface PropsInterface {
    position?: [number, number, number];
    chassisApi?: PublicApi;
    gameStatus: string;
    socket: MySocket;
}

export const useControls = (props: PropsInterface) => {
    const [controls, setControls] = useState<StateInterface>({});

    useEffect(() => {
        const keyDownPressHandler = (e: KeyboardEvent) => {
            setControls((controls) => ({
                ...controls,
                [e.key.toLowerCase()]: true,
            }));
        };

        const keyUpPressHandler = (e: KeyboardEvent) => {
            setControls((controls) => ({
                ...controls,
                [e.key.toLowerCase()]: false,
            }));
        };

        window.addEventListener("keydown", keyDownPressHandler);
        window.addEventListener("keyup", keyUpPressHandler);

        return () => {
            window.removeEventListener("keydown", keyDownPressHandler);
            window.removeEventListener("keyup", keyUpPressHandler);
        };
    }, []);

    const { id } = props.socket;
    const idRef = useRef(id);

    useFrame(() => {
        if (props.socket) {
            if (props.chassisApi && props.gameStatus === "active") {
                let x = 0;
                let z = 0;
                let count = 1;
                if (controls.w) {
                    ++count;
                    z += MOVEMENT_SPEED;
                }
                if (controls.s) {
                    ++count;
                    z -= MOVEMENT_SPEED;
                }
                if (controls.a) {
                    ++count;
                    x += MOVEMENT_SPEED;
                }
                if (controls.d) {
                    ++count;
                    x -= MOVEMENT_SPEED;
                }
                props.chassisApi.velocity.set(x / count, 0, z / count);
            } else if (props.chassisApi && props.gameStatus !== "active") {
                props.chassisApi.velocity.set(0, 0, 0);
            }
        }
    });

    const positionRef = useRef(props.position);

    useEffect(() => {
        positionRef.current = props.position;
    }, [props.position]);

    useEffect(() => {
        idRef.current = id;
    }, [id])

    return controls;
};
