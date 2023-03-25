import { PublicApi } from "@react-three/cannon";
import React, { useEffect, useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MySocket } from "../Interfaces/Sockets/SocketIOInterface";

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
                if (controls.w) {
                    z += 5;
                }
                if (controls.s) {
                    z -= 5;
                }
                if (controls.a) {
                    x += 5;
                }
                if (controls.d) {
                    x -= 5;
                }
                props.chassisApi.velocity.set(x, 0, z);
            } else if (props.chassisApi && props.gameStatus !== "active") {
                props.chassisApi.velocity.set(0, 0, 0);
            }
        }
    });

    const MINUTE_MS = 1000 / 32;

    const positionRef = useRef(props.position);

    useEffect(() => {
        positionRef.current = props.position;
    }, [props.position]);

    useEffect(() => {
        idRef.current = id;
    }, [id])

    useEffect(() => {
        let interval: NodeJS.Timer;
        if (props.chassisApi) {
            interval = setInterval(() => {
                props?.socket.emit("move", {
                    id,
                    position: positionRef.current,
                });
            }, MINUTE_MS);
        }
            
        return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
    }, [])

    return controls;
};