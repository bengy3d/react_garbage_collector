import React from "react";
import {
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { Suspense } from "react";

export const Scene = () => {
  return (
    <Suspense fallback={null}>
      <Environment
        files={`${process.env.PUBLIC_URL}/textures/envmap.hdr`}
        background={true}
      />
      <PerspectiveCamera
        makeDefault
        position={[0, 9, -10]}
        fov={40}
      />
      <OrbitControls target={[0, 0, 0]} />
    </Suspense>
  );
};
