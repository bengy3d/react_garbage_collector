import {
    CollideBeginEvent,
    CollideEndEvent,
    Triplet,
    useBox,
} from "@react-three/cannon";
import React from "react";
import { GameConfig } from "../GameConfig";

interface PropsInterface {
    position: Triplet;
    scale: Triplet;
    onCollideBegin?: (e?: CollideBeginEvent) => void;
    onCollideEnd?: (e?: CollideEndEvent) => void;
    noCollision?: Boolean;
}

export const BoxCollider = (props: PropsInterface) => {
    useBox(
        () => ({
            args: props.scale,
            position: props.position,
            type: "Static",
            onCollideBegin: props.onCollideBegin
                ? props.onCollideBegin
                : () => {},
            onCollideEnd: props.onCollideEnd ? props.onCollideEnd : () => {},
            collisionResponse: props.noCollision ? false : true,
        }),
        undefined,
        [
            props.position,
            props.onCollideBegin,
            props.onCollideEnd,
            props.noCollision,
        ]
    );

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
