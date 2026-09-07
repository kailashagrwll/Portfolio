import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { InteractiveZoneBadge } from './InteractiveZoneBadge';

export function AboutZone({ position = [0, 0, -18], isNearby, onInteract }) {
  const ringRef = useRef();
  const ring2Ref = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ringRef.current) ringRef.current.rotation.y = t * 0.4;
    if (ring2Ref.current) ring2Ref.current.rotation.x = t * 0.3;
  });

  return (
    <group position={position}>
      <InteractiveZoneBadge
        title="About Pavilion"
        subtitle="Identity & Philosophy"
        color="#7928ca"
        isNearby={isNearby}
        onInteract={onInteract}
      />

      {/* Terraced circular base */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[4.2, 4.6, 0.2, 32]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[3.4, 3.8, 0.15, 32]} />
        <meshStandardMaterial color="#ede9fe" roughness={0.2} metalness={0.4} />
      </mesh>

      {/* Cyberpunk Architectural Pillars - Clean White with Violet Light */}
      {[-2.2, 2.2].map((x) =>
        [-2.2, 2.2].map((z) => (
          <group key={`${x}-${z}`} position={[x, 0, z]}>
            {/* Pillar */}
            <mesh position={[0, 1.8, 0]}>
              <boxGeometry args={[0.35, 3.6, 0.35]} />
              <meshStandardMaterial color="#ffffff" metalness={0.3} roughness={0.2} />
            </mesh>
            {/* Neon Vertical Light Strip */}
            <mesh position={[0, 1.8, 0.19]}>
              <boxGeometry args={[0.08, 3.2, 0.04]} />
              <meshBasicMaterial color="#a855f7" />
            </mesh>
          </group>
        ))
      )}

      {/* Futuristic Glass Canopy Roof */}
      <mesh position={[0, 3.8, 0]}>
        <coneGeometry args={[3.2, 1.2, 4]} rotation={[0, Math.PI / 4, 0]} />
        <meshStandardMaterial
          color="#a855f7"
          roughness={0.1}
          metalness={0.5}
          transparent
          opacity={0.65}
        />
      </mesh>

      {/* Central Holographic Core Pedestal */}
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.8, 1.0, 1.0, 16]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.3} metalness={0.5} />
      </mesh>

      {/* Gyroscopic Hologram Rings */}
      <group position={[0, 1.8, 0]}>
        <mesh ref={ringRef}>
          <torusGeometry args={[0.9, 0.04, 16, 40]} />
          <meshBasicMaterial color="#c084fc" />
        </mesh>
        <mesh ref={ring2Ref} rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[0.7, 0.04, 16, 40]} />
          <meshBasicMaterial color="#e879f9" />
        </mesh>
        {/* Core Sphere */}
        <mesh>
          <sphereGeometry args={[0.35, 20, 20]} />
          <meshStandardMaterial
            color="#a855f7"
            emissive="#7e22ce"
            emissiveIntensity={0.8}
            roughness={0.1}
          />
        </mesh>
      </group>
    </group>
  );
}
