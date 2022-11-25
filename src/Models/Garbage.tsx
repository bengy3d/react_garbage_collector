import { CollideEvent, Triplet, useBox } from '@react-three/cannon';
import React, { useEffect, useRef } from 'react';
import { BufferGeometry, Mesh } from 'three';
import { PlayerStateInterface } from '../Interfaces/PlayerStateInterace';

interface PropsInterface {
    playerState: React.MutableRefObject<PlayerStateInterface>;
}

export const Garbage = (props: PropsInterface) => {
    const position: Triplet = [1.5, 3, 3]

    const width = 1;
    const height = 1;
    const front = 1;
    const chassisBodyArgs: Triplet = [width, height, front];

    const onCollision = (e: CollideEvent) => {
        if (props.playerState.current?.playerId === e.contact.bi.id) {
            chassisApi.position.set(5, 1, -5);
        }
    }

    const [chassisBody, chassisApi] = useBox(
        () => ({
            args: chassisBodyArgs,
            mass: 5,
            position,
            onCollide: onCollision,
        }),
        useRef(null),
    );

    useEffect(() => {

        console.log(props.playerState)
    }, [props.playerState])

    return (
        <mesh ref={chassisBody as React.RefObject<Mesh<BufferGeometry>>}>
            <meshBasicMaterial color="green" opacity={0.3} />
            <boxGeometry args={chassisBodyArgs} />
        </mesh>
    );
}