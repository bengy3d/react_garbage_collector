import { PublicApi } from "@react-three/cannon";
import React, { useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";

interface StateInterface {
    [value: string]: boolean;
}

interface PropsInterface {
    chassisBody?: React.RefObject<THREE.Object3D<THREE.Event>>;
    chassisApi?: PublicApi;
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
        if (props.chassisApi) {
            if (controls.w) {
                props.chassisApi.velocity.set(0, 0, 5);
            } else if (controls.s) {
                props.chassisApi.velocity.set(0, 0, -5);
            }  else if (controls.a) {
                props.chassisApi.velocity.set(5, 0, 0);
            } else if (controls.d) {
                props.chassisApi.velocity.set(-5, 0, 0);
            } else {
                props.chassisApi.velocity.set(0, 0, 0);
            }
        }
    });

    return controls;
};
