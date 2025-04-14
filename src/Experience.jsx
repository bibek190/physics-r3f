import { Html, OrbitControls, Text } from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
} from "@react-three/rapier";
import { Perf } from "r3f-perf";
import { useRef } from "react";
import * as THREE from "three";

export default function Experience() {
  const cube = useRef();

  const cubeJump = (state, delta) => {
    cube.current.applyImpulse({ x: 0, y: 5, z: 0 });
    cube.current.applyTorqueImpulse({
      x: Math.random() - 0.5,
      y: 1,
      z: Math.random() - 0.5,
    });
  };
  const scene = new THREE.Scene();
  const clicked = () => {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(2, 2, 2),
      new THREE.MeshBasicMaterial()
    );
    scene.add(mesh);
  };

  return (
    <>
      <Perf position="top-left" />

      <OrbitControls makeDefault />

      <directionalLight castShadow position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1.5} />
      <Physics gravity={[0, -9.82, 0]}>
        <RigidBody colliders="ball">
          <mesh castShadow position={[-1.5, 2, 0]}>
            <sphereGeometry />
            <meshStandardMaterial color="orange" />
          </mesh>
        </RigidBody>
        <RigidBody
          ref={cube}
          position={[1.5, 2, 0]}
          gravityScale={1}
          restitution={0}
          friction={0}
        >
          <mesh castShadow onClick={cubeJump}>
            <boxGeometry />
            <meshStandardMaterial color="orange" />
          </mesh>
        </RigidBody>

        <RigidBody type="fixed" friction={0}>
          <mesh receiveShadow position-y={-1.25}>
            <boxGeometry args={[10, 0.5, 10]} />
            <meshStandardMaterial color="greenyellow" />
          </mesh>
        </RigidBody>
        <Text scale={5} position={[0, 2, -5]} color={"green"} onClick={clicked}>
          Hello
        </Text>
      </Physics>
    </>
  );
}
