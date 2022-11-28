import { Triplet } from '@react-three/cannon';
import { useLoader } from '@react-three/fiber';
import React, { Suspense, useEffect } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { BoxCollider } from '../Colliders/BoxCollider';
import { PlayerStateInterface } from '../Interfaces/PlayerStateInterace';

interface PropsInterface {
    playerState: React.MutableRefObject<PlayerStateInterface>;
    position: Triplet;
    type: string;
    increaseScore: () => void;
}

const getModelName = (type: string) => {
    switch(type) {
        case 'bioodpady':
            return 'BioTrash';
        case 'papier':
            return 'PaperTrash';
        case 'odpady zmieszane':
            return 'MixedTrash';
        case 'metale i tworzywa sztuczne':
            return 'MetalTrash';
        case 'szkło':
            return 'GlassTrash';
    }
}

export const TrashCan = (props: PropsInterface) => {
    const object = useLoader(
        GLTFLoader,
        `${process.env.PUBLIC_URL}/models/${getModelName(props.type)}.glb`
    ).scene;

    useEffect(() => {
        object.scale.set(2, 2, 2);
        object.rotation.set(0, Math.PI, 0);
        object.position.set(props.position[0], props.position[1], props.position[2]);
    }, [object])

    const onCollide = () => {
        if (props.playerState.current.garbage.type === props.type) {
            props.increaseScore();
            console.log(`garbage dropped`);
            console.log(props.playerState);
        }
    }

    return (
        <Suspense>
            <primitive object={object}/>
            <BoxCollider position={props.position} scale={[1, 2, 1]} onCollide={onCollide}/>
        </Suspense>
    );
}