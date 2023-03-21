import {
    CollideBeginEvent,
    CollideEndEvent,
    Triplet,
} from "@react-three/cannon";
import { useLoader } from "@react-three/fiber";
import React, { Suspense, useEffect, useMemo, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { BoxCollider } from "../Colliders/BoxCollider";
import { useControls } from "../Hooks/useControls";
import { SocketClient } from "../SocketClient";
import { ClientInterface } from "../Interfaces/Sockets/ClientInterface";

interface PropsInterface {
    playerState: React.MutableRefObject<ClientInterface>;
    gameStatus: string;
    location: Triplet;
}

export const Garbage = (props: PropsInterface) => {
    const controls = useControls({
        socket: SocketClient,
        gameStatus: props.gameStatus,
    });
    const [collisionActive, setCollisionActive] = useState<Boolean>(false);

    const { scene } = useLoader(
        GLTFLoader,
        process.env.PUBLIC_URL + "/models/BasicTrash.glb"
    );

    const copiedScene = useMemo(() => scene.clone(), [scene]);

    useEffect(() => {
        copiedScene.rotation.set(0, Math.PI, 0);
        copiedScene.scale.set(1.4, 1.4, 1.4);
        copiedScene.position.set(
            props.location[0],
            props.location[1],
            props.location[2]
        );
    }, [copiedScene]);

    const onCollisionBegin = (e?: CollideBeginEvent) => {
        console.log('collision');
        if (
            props.playerState.current?.playerId === e?.body.id &&
            !props.playerState.current?.garbage?.type
        ) {
            setCollisionActive(true);
        }
    };

    const onCollisionEnd = (e?: CollideEndEvent) => {
        if (
            props.playerState.current?.playerId === e?.body.id &&
            !props.playerState.current?.garbage?.type
        ) {
            setCollisionActive(false);
        }
    };

    useEffect(() => {
        if (controls.e && collisionActive) {
            setCollisionActive(false);
            SocketClient.emit("garbagePickedUp");
        }
    }, [controls.e, collisionActive]);

    useEffect(() => {
        copiedScene.position.set(
            props.location[0],
            props.location[1],
            props.location[2]
        );
    }, [props.location]);

    return (
        <Suspense>
            <primitive object={copiedScene} />
            <BoxCollider
                position={props.location}
                scale={[0.5, 1, 0.5]}
                onCollideBegin={onCollisionBegin}
                onCollideEnd={onCollisionEnd}
            />
        </Suspense>
    );
};
