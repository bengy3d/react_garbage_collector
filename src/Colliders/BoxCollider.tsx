import { Triplet, useBox } from '@react-three/cannon';
import React from 'react';
import { GameConfig } from '../GameConfig';

interface PropsInterface {
    position: Triplet;
    scale: Triplet;
    onCollide?: () => void;
}

export const BoxCollider = (props: PropsInterface) => {
    useBox(() => ({
        args: props.scale,
        position: props.position,
        type: 'Static',
        onCollide: props.onCollide ? props.onCollide : () => {},
    }))

    return (
        <>
            {GameConfig.debug && (
                <mesh position={props.position}>
                    <boxGeometry args={props.scale}/>
                    <meshBasicMaterial transparent={true} opacity={GameConfig.debugOpacity} />
                </mesh>
            )}
        </>
    );
}