import { Triplet } from '@react-three/cannon';
import { useLoader } from '@react-three/fiber';
import React, { Suspense, useEffect } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { BoxCollider } from '../Colliders/BoxCollider';

interface PropsInterface {
    position: Triplet,
}

export const Cubicle = (props: PropsInterface) => {

    const object = useLoader(
        GLTFLoader,
        process.env.PUBLIC_URL + '/models/Cubicle.glb'
    ).scene;

    useEffect(() => {
        object.scale.set(0.65, 0.65, 0.65);
        object.position.set(props.position[0] - 0.3, props.position[1], props.position[2]);
    }, [object])

    return (
        <Suspense>
            <primitive object={object}/>
            <BoxCollider position={props.position} scale={[1.35, 2, 2]} />
        </Suspense>
    );
}