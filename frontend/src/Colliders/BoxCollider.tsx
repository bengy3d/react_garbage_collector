import {
    CollideBeginEvent,
    CollideEndEvent,
    Triplet,
    useBox,
} from "@react-three/cannon";
import React, { useEffect } from "react";
import { GameConfig } from "../GameConfig";

interface PropsInterface {
    position: Triplet;
    scale: Triplet;
    onCollideBegin?: (e?: CollideBeginEvent) => void;
    onCollideEnd?: (e?: CollideEndEvent) => void;
    noCollision?: Boolean;
}

export const BoxCollider = (props: PropsInterface) => {
    const [boxRef, api] = useBox(() => ({
        args: props.scale,
        position: props.position,
        type: "Static",
        onCollideBegin: props.onCollideBegin ? props.onCollideBegin : () => {},
        onCollideEnd: props.onCollideEnd ? props.onCollideEnd : () => {},
        collisionResponse: props.noCollision ? false : true,
    }));

    useEffect(() => {
        if (props.position) {
            api.position.set(
                props.position[0],
                props.position[1],
                props.position[2]
            );
        }
    }, [props.position]);

    return (
        <>
            {GameConfig.debug && (
                <mesh position={props.position}>
                    <boxGeometry args={props.scale} />
                    <meshBasicMaterial
                        transparent={true}
                        opacity={GameConfig.debugOpacity}
                    />
                </mesh>
            )}
        </>
    );
};
