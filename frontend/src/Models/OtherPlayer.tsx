import { Triplet } from "@react-three/cannon";
import { useEffect, useRef } from "react";
import { useInterpolation } from "../Hooks/useInterpolation";
import { Mesh, Vector3 } from 'three';
import { TICK_RATE } from "../constants";

interface PropsInterface {
    clientId: string;
    position: [number, number, number];
}

export const OtherPlayer = (props: PropsInterface) => {
    const width = 0.4;
    const height = 30;
    const front = 30;
    const chassisBodyArgs: Triplet = [width, height, front];

    const { lastState, currentState, lastUpdateTime, updateState } = useInterpolation();
    const meshRef = useRef<Mesh>(null);

    useEffect(() => {
        updateState({position: new Vector3(props.position[0], props.position[1], props.position[2])});
        if (lastState && currentState && meshRef.current) {
          const now = Date.now();
          const timeSinceLastUpdate = now - lastUpdateTime;
          const t = timeSinceLastUpdate / (TICK_RATE);
    
          const interpolatedPosition = new Vector3().lerpVectors(
            lastState.position,
            currentState.position,
            t
          );
    
          meshRef.current.position.copy(interpolatedPosition);
        }
    }, [props.position]);

    return (
        <mesh ref={meshRef}>
            <meshBasicMaterial color="red" opacity={0.3} />
            <sphereGeometry args={chassisBodyArgs} />
        </mesh>
    );
};
