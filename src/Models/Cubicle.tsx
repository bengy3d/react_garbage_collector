import { useLoader } from '@react-three/fiber';
import React, { Suspense, useEffect } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export const Cubicle = () => {

    const object = useLoader(
        GLTFLoader,
        process.env.PUBLIC_URL + '/models/Cubicle.glb'
    ).scene;

    useEffect(() => {
        object.scale.set(0.65, 0.65, 0.65);
        object.position.set(4, 0, 3);
    }, [object])

    return (
        <Suspense>
            <primitive object={object}/>
        </Suspense>
    );
}