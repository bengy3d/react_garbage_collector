import { Triplet } from "@react-three/cannon";
import { useLoader } from "@react-three/fiber";
import React, { Suspense, useEffect, useMemo } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { BoxCollider } from "../Colliders/BoxCollider";

interface PropsInterface {
    position: Triplet;
}

export const Cubicle = (props: PropsInterface) => {
    const { scene } = useLoader(
        GLTFLoader,
        process.env.PUBLIC_URL + "/models/Cubicle.glb"
    );

    const copiedScene = useMemo(() => scene.clone(), [scene]);

    useEffect(() => {
        copiedScene.scale.set(0.65, 0.65, 0.65);
        copiedScene.position.set(
            props.position[0] - 0.3,
            props.position[1],
            props.position[2]
        );
    }, [copiedScene]);

    return (
        <Suspense>
            <primitive object={copiedScene} />
            <BoxCollider position={props.position} scale={[1.35, 2, 2]} />
        </Suspense>
    );
};
