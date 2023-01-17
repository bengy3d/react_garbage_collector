import { PublicApi } from "@react-three/cannon";
import React, { useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";

interface StateInterface {
    [value: string]: boolean;
}

interface PropsInterface {
    chassisBody?: React.RefObject<THREE.Object3D<THREE.Event>>;
    chassisApi?: PublicApi;
    gameStatus: string;
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

    useFrame(() => {
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
    });

    return controls;
};
