import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { InteractiveZoneBadge } from './InteractiveZoneBadge';

export function ContactZone({ position = [16, 0, 16], isNearby, onInteract }) {
  const dishRef = useRef();
  const waveRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (dishRef.current) {
      dishRef.current.rotation.y = t * 0.4;
    }
    if (waveRef.current) {
      waveRef.current.scale.setScalar(1 + (Math.sin(t * 3) * 0.2));
    }
  });

  return (
    <group position={position}>
      <InteractiveZoneBadge
        title="Contact Relay"
        subtitle="Communications Array"
        color="#00d2ff"
        isNearby={isNearby}
        onInteract={onInteract}
      />

      {/* Array Base - Clean White Porcelain */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[3.6, 4.0, 0.2, 8]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.3} />
      </mesh>
      {/* Cyan ring */}
      <mesh position={[0, 0.22, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.2, 3.4, 8]} />
        <meshBasicMaterial color="#00d2ff" />
      </mesh>

      {/* Communications Mast Tower - Sleek White Composite */}
      <mesh position={[0, 1.4, 0]}>
        <cylinderGeometry args={[0.2, 0.4, 2.6, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.4} />
      </mesh>

      {/* Rotating Satellite Dish - High-Tech White & Cyan */}
      <group ref={dishRef} position={[0, 2.7, 0]}>
        {/* Parabolic dish */}
        <mesh rotation={[Math.PI / 4, 0, 0]}>
          <cylinderGeometry args={[1.2, 0.1, 0.4, 16, 1, true]} />
          <meshStandardMaterial color="#f1f5f9" side={2} metalness={0.5} roughness={0.2} />
        </mesh>
        {/* Transmitter needle */}
        <mesh position={[0, 0.2, 0.3]} rotation={[Math.PI / 4, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.8, 8]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
        {/* Signal beacon sphere */}
        <mesh position={[0, 0.5, 0.6]}>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshBasicMaterial color="#00f0ff" />
        </mesh>
      </group>

      {/* Pulsing signal wave ring */}
      <mesh ref={waveRef} position={[0, 3.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.8, 0.95, 24]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}
