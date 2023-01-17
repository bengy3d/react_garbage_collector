import { CollideBeginEvent, CollideEndEvent, Triplet } from "@react-three/cannon";
import { useLoader } from "@react-three/fiber";
import React, { Suspense, useEffect, useMemo, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { BoxCollider } from "../Colliders/BoxCollider";
import { PlayerStateInterface } from "../Interfaces/PlayerStateInterace";
import { DESK_MAP } from "../constants";
import { useControls } from "../Hooks/useControls";

interface PropsInterface {
    playerState: React.MutableRefObject<PlayerStateInterface>;
    setPlayerGarbage: () => void;
    gameStatus: string
}

const getRandomLocation = (): Triplet => {
    const randomDesk = DESK_MAP[Math.floor(Math.random() * DESK_MAP.length)];
    const next: Triplet = [
        randomDesk[0] + 1.1,
        randomDesk[1] + 0.01,
        randomDesk[2] - 1,
    ];
    return next;
};

export const Garbage = (props: PropsInterface) => {
    const controls = useControls({gameStatus: props.gameStatus});
    const [collisionActive, setCollisionActive] = useState<Boolean>(false);
    const [nextLocation, setNextLocation] = useState<Triplet>(
        getRandomLocation()
    );

    const { scene } = useLoader(
        GLTFLoader,
        process.env.PUBLIC_URL + "/models/BasicTrash.glb"
    );

    const copiedScene = useMemo(() => scene.clone(), [scene]);

    useEffect(() => {
        copiedScene.rotation.set(0, Math.PI, 0);
        copiedScene.scale.set(1.4, 1.4, 1.4);
        copiedScene.position.set(
            nextLocation[0],
            nextLocation[1],
            nextLocation[2]
        );
    }, [copiedScene]);

    const onCollisionBegin = (e?: CollideBeginEvent) => {
        if (
            props.playerState.current?.playerId === e?.body.id &&
            !props.playerState.current.garbage.type
        ) {
            console.log('collision is active :)')
            setCollisionActive(true);
        }
    };

    const onCollisionEnd = (e?: CollideEndEvent) => {
        if (
            props.playerState.current?.playerId === e?.body.id &&
            !props.playerState.current.garbage.type
        ) {
            console.log('collision is over :(')
            setCollisionActive(false);
        }
    };

    useEffect(() => {
        if (controls.e && collisionActive) {
            setCollisionActive(false);
            props.setPlayerGarbage();
            const next = getRandomLocation();
            setNextLocation(next);
            copiedScene.position.set(next[0], next[1], next[2]);
        }
    }, [controls.e, collisionActive])

    return (
        <Suspense>
            <primitive object={copiedScene} />
            <BoxCollider
                position={nextLocation}
                scale={[0.5, 1, 0.5]}
                onCollideBegin={onCollisionBegin}
                onCollideEnd={onCollisionEnd}
            />
        </Suspense>
    );
};
