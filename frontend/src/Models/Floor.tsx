import { useLoader } from '@react-three/fiber';
import React, { Suspense } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { WallColliders } from '../Colliders/WallColliders';


export const Floor = () => {

    const object = useLoader(
        GLTFLoader,
        '/models/Floor.glb'
    )

    return (
        <Suspense>
            <primitive object={object.scene}/>
            <WallColliders />
        </Suspense>
    );
}
