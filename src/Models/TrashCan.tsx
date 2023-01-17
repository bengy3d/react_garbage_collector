import { Triplet } from "@react-three/cannon";
import { useLoader } from "@react-three/fiber";
import React, { Suspense, useEffect, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { BoxCollider } from "../Colliders/BoxCollider";
import { useControls } from "../Hooks/useControls";
import { PlayerStateInterface } from "../Interfaces/PlayerStateInterace";

interface PropsInterface {
    playerState: React.MutableRefObject<PlayerStateInterface>;
    position: Triplet;
    type: string;
    increaseScore: () => void;
    resetGarbageState: () => void;
    gameStatus: string;
}

const getModelName = (type: string) => {
    switch (type) {
        case "bioodpady":
            return "BioTrash";
        case "papier":
            return "PaperTrash";
        case "odpady zmieszane":
            return "MixedTrash";
        case "metale i tworzywa sztuczne":
            return "MetalTrash";
        case "szkło":
            return "GlassTrash";
    }
};

export const TrashCan = (props: PropsInterface) => {
    const [collisionActive, setCollisionActive] = useState<Boolean>(false);
    const controls = useControls({gameStatus: props.gameStatus});
    const object = useLoader(
        GLTFLoader,
        `${process.env.PUBLIC_URL}/models/${getModelName(props.type)}.glb`
    ).scene;

    const onCollideBegin = () => {
        if (props.playerState.current.garbage.type) {
            setCollisionActive(true);
        }
    };

    const onCollideEnd = () => {
        if (props.playerState.current.garbage.type) {
            setCollisionActive(false);
        }
    };

    useEffect(() => {
        if (props.playerState.current.garbage.type === props.type && controls.e && collisionActive) {
            setCollisionActive(false);
            props.increaseScore();
            console.log(`garbage dropped`);
            console.log(props.playerState);
        } else if (controls.e && collisionActive) {
            setCollisionActive(false);
            props.resetGarbageState();
            console.log(`WRONG trash can`);
        }
    }, [controls.e, collisionActive]);

    useEffect(() => {
        object.scale.set(2, 2, 2);
        object.rotation.set(0, Math.PI, 0);
        object.position.set(
            props.position[0],
            props.position[1],
            props.position[2]
        );
    }, [object]);

    return (
        <Suspense>
            <primitive object={object} />
            <BoxCollider
                position={props.position}
                scale={[1, 2, 1]}
                onCollideBegin={onCollideBegin}
                onCollideEnd={onCollideEnd}
            />
        </Suspense>
    );
};
