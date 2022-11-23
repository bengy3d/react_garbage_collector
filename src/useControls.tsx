import { PublicApi } from "@react-three/cannon";
import React, { useEffect, useState } from "react";
import { Vector3 } from "three";

interface StateInterface {
  [value: string]: boolean;
}

interface PropsInterface {
  chassisBody: React.RefObject<THREE.Object3D<THREE.Event>>;
  chassisApi: PublicApi;
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

  useEffect(() => {
    if (controls.w) {
      props.chassisApi.applyImpulse([0,1,100], [0,0,0]);
      console.log(props.chassisBody.current?.position);
    } else if (controls.s) {
      props.chassisApi.applyImpulse([0, 1, -100], [0, 0, 0]);
    } else if (controls.a) {
      props.chassisApi.applyImpulse([100, 1, 0], [0, 0, 0]);
    } else if (controls.d) {
      props.chassisApi.applyImpulse([-100, 1, 0], [0, 0, 0]);
    }
  }, [controls, props.chassisApi, props.chassisBody]);

  return controls;
};
