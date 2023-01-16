import { useLoader } from '@react-three/fiber';
import React, { Suspense } from 'react';
import { BufferGeometry } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { WallColliders } from '../Colliders/WallColliders';


export const Floor = () => {

    const object = useLoader(
        GLTFLoader,
        process.env.PUBLIC_URL + '/models/Floor.glb'
    )

    return (
        <Suspense>
            <primitive object={object.scene}/>
            <WallColliders />
        </Suspense>
    );
}