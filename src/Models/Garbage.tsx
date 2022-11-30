import { CollideEvent, Triplet } from "@react-three/cannon";
import { useLoader } from "@react-three/fiber";
import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { BoxCollider } from "../Colliders/BoxCollider";
import { PlayerStateInterface } from "../Interfaces/PlayerStateInterace";

interface PropsInterface {
    playerState: React.MutableRefObject<PlayerStateInterface>;
    setPlayerGarbage: () => void;
    position: Triplet;
}

export const Garbage = (props: PropsInterface) => {
    const [nextLocation, setNextLocation] = useState<Triplet>(props.position);

    const { scene } = useLoader(
        GLTFLoader,
        process.env.PUBLIC_URL + "/models/BasicTrash.glb"
    );

    const copiedScene = useMemo(() => scene.clone(), [scene]);

    useEffect(() => {
        copiedScene.rotation.set(0, Math.PI, 0);
        copiedScene.scale.set(1.4, 1.4, 1.4);
        copiedScene.position.set(
            props.position[0],
            props.position[1],
            props.position[2]
        );
    }, [copiedScene]);


    const onCollision = (e?: CollideEvent) => {
        if (
            props.playerState.current?.playerId === e?.contact.bi.id &&
            !props.playerState.current.garbage.type
        ) {
            props.setPlayerGarbage();
            const next: Triplet = [5, 0, -5];
            setNextLocation(next);
            copiedScene.position.set(next[0], next[1], next[2]);
        }
    };

    return (
        <Suspense>
            <primitive object={copiedScene} />
            <BoxCollider position={nextLocation} scale={[0.5, 1, 0.5]} onCollide={onCollision} />
        </Suspense>
    );
};
