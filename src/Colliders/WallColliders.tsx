import React, { Suspense } from "react";
import { BoxCollider } from "../Colliders/BoxCollider";


export const WallColliders = () => {

    return (
        <Suspense>
            <BoxCollider position={[8.5, 1, 0]} scale={[0.3, 2, 19]} />
            <BoxCollider position={[-8.5, 1, 0]} scale={[0.3, 2, 19]} />
            <BoxCollider position={[0, 1, 9.5]} scale={[17, 2, 0.3]} />
            <BoxCollider position={[0, 1, -9.5]} scale={[17, 2, 0.3]} />
        </Suspense>
    );
};

