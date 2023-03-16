import { Triplet } from "@react-three/cannon";

interface PropsInterface {
    clientId: string;
    position: [number, number, number];
}

export const OtherPlayer = (props: PropsInterface) => {
    const width = 0.4;
    const height = 30;
    const front = 30;
    const chassisBodyArgs: Triplet = [width, height, front];

    return (
        <mesh position={props.position}>
            <meshBasicMaterial color="grey" opacity={0.3} />
            <sphereGeometry args={chassisBodyArgs} />
        </mesh>
    );
};
