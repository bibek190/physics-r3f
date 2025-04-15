import { OrbitControls } from "@react-three/drei";
import {
  BallCollider,
  CapsuleCollider,
  CuboidCollider,
  Physics,
  RigidBody,
} from "@react-three/rapier";
import { Perf } from "r3f-perf";
import React, { Suspense, useRef } from "react";

const Experience = () => {
  const cubeRef = useRef();

  const cubeJump = () => {
    cubeRef.current.applyImpulse({ x: 0, y: 5, z: 0 });
    cubeRef.current.applyTorqueImpulse({
      x: Math.random() - 0.5,
      y: Math.random() - 0.5,
      z: Math.random() - 0.5,
    });
  };

  return (
    <>
      <Perf position="top-left" />
      <OrbitControls makeDefault />
      <ambientLight intensity={1} />
      <directionalLight castShadow position={[1, 2, 3]} intensity={1.5} />
      <Suspense>
        <Physics debug>
          <RigidBody colliders="ball" position={[-1, 2, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[0.75]} />
              <meshStandardMaterial color={"orange"} />
            </mesh>
          </RigidBody>
          <RigidBody
            ref={cubeRef}
            position={[1.5, 1, 0]}
            rotation-x={Math.PI * 0.5}
          >
            <mesh castShadow onClick={cubeJump}>
              <boxGeometry />
              <meshStandardMaterial color="mediumpurple" />
            </mesh>
          </RigidBody>

          <RigidBody type="fixed">
            <mesh receiveShadow position-y={-1.25}>
              <boxGeometry args={[10, 0.5, 10]} />
              <meshStandardMaterial color={"lightgreen"} />
            </mesh>
          </RigidBody>
        </Physics>
      </Suspense>
    </>
  );
};

export default Experience;
