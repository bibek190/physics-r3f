import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import {
  BallCollider,
  CapsuleCollider,
  CuboidCollider,
  CylinderCollider,
  InstancedRigidBodies,
  Physics,
  RigidBody,
} from "@react-three/rapier";
import { Perf } from "r3f-perf";
import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const Experience = () => {
  const [hitSound] = useState(() => new Audio("./hit.mp3"));

  const cubeRef = useRef();
  const twister = useRef();

  // load model
  const hamburger = useGLTF("./hamburger.glb");

  const cubeCount = 200;

  const instances = useMemo(() => {
    const instances = [];
    for (let i = 0; i < cubeCount; i++) {
      instances.push({
        key: "instance_" + i,
        position: [
          (Math.random() - 0.5) * 8,
          6 + i * 0.2,
          (Math.random() - 0.5) * 2,
        ],
        rotations: [Math.random(), Math.random(), Math.random()],
      });
    }
    return instances;
  }, []);

  const cubeJump = () => {
    const mass = cubeRef.current.mass();
    cubeRef.current.applyImpulse({ x: 0, y: 5 * mass, z: 0 });
    cubeRef.current.applyTorqueImpulse({
      x: Math.random() - 0.5,
      y: Math.random() - 0.5,
      z: Math.random() - 0.5,
    });
  };

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const eulerRotation = new THREE.Euler(0, time * 3, 0);
    const quaternionRotation = new THREE.Quaternion();
    quaternionRotation.setFromEuler(eulerRotation);
    if (twister.current) {
      twister.current.setNextKinematicRotation(quaternionRotation);

      const angle = time * 0.5;
      const x = Math.cos(angle) * 2;
      const z = Math.sin(angle) * 2;
      twister.current.setNextKinematicTranslation({ x: x, y: -0.8, z: z });
    }
  });

  const collisionEnter = () => {
    // console.log(hitSound);
    // hitSound.currentTime = 0;
    // hitSound.volume = Math.random();
    // hitSound.play();
  };

  return (
    <>
      <Perf position="top-left" />
      <OrbitControls makeDefault />
      <ambientLight intensity={0.4} />
      <color args={["ivory"]} attach="background" />
      <directionalLight castShadow position={[1, 2, 3]} intensity={1.0} />

      <Suspense>
        <EffectComposer>
          <Bloom
            luminanceThreshold={0}
            luminanceSmoothing={0.9}
            intensity={1.5} // Increase for more glow
          />
        </EffectComposer>
        <Physics gravity={[0, -2.82, 0]}>
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
            // restitution={0.5}
            friction={0.7}
            colliders={false}
            onCollisionEnter={collisionEnter}
          >
            <mesh castShadow onClick={cubeJump}>
              <boxGeometry />
              <meshStandardMaterial color="mediumpurple" />
              <CuboidCollider args={[0.5, 0.5, 0.5]} mass={2} />
            </mesh>
          </RigidBody>

          <RigidBody type="fixed">
            <mesh receiveShadow position-y={-1.25}>
              <boxGeometry args={[10, 0.5, 10]} />
              <meshStandardMaterial color={"lightgreen"} />
            </mesh>
          </RigidBody>
          {/* ROTATING CUBE */}
          <RigidBody
            ref={twister}
            position={[0, -0.8, 0]}
            friction={0}
            type={"kinematicPosition"}
          >
            <mesh castShadow scale={[0.4, 0.4, 5]}>
              <boxGeometry />
              <meshStandardMaterial color={"blue"} />
            </mesh>
          </RigidBody>
          <RigidBody colliders={false} position={[-0.5, 3, 0]} mass={2}>
            <CylinderCollider args={[0.5, 1.25]} />
            <primitive object={hamburger.scene} scale={0.25} />
          </RigidBody>
          <RigidBody type="fixed" restitution={2}>
            <CuboidCollider args={[5, 2, 0.5]} position={[0, 1, 5.25]} />
            <CuboidCollider args={[5, 2, 0.5]} position={[0, 1, -5.25]} />
            <CuboidCollider args={[0.5, 2, 5]} position={[5.25, 1, 0]} />
            <CuboidCollider args={[0.5, 2, 5]} position={[-5.25, 1, 0]} />
          </RigidBody>
          <InstancedRigidBodies instances={instances}>
            <instancedMesh args={[null, null, cubeCount]}>
              <boxGeometry />
              <meshStandardMaterial emissive={"red"} emissiveIntensity={1} />
            </instancedMesh>
          </InstancedRigidBodies>
        </Physics>
      </Suspense>
    </>
  );
};

export default Experience;
