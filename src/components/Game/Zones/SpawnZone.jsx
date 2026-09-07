import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { InteractiveZoneBadge } from './InteractiveZoneBadge';

export function SpawnZone({ position = [0, 0, 0], isNearby, onInteract }) {
  const crystalRef = useRef();

  useFrame((state) => {
    if (crystalRef.current) {
      crystalRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
    }
  });

  return (
    <group position={position}>
      <InteractiveZoneBadge
        title="Spawn Plaza"
        subtitle="Arrival Monument"
        color="#00f0ff"
        isNearby={isNearby}
        onInteract={onInteract}
      />

      {/* Hexagonal Platform base - Clean White Porcelain */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[3.2, 3.4, 0.16, 6]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.3} />
      </mesh>

      {/* Neon rim ring */}
      <mesh position={[0, 0.18, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.0, 3.18, 6]} />
        <meshBasicMaterial color="#00f0ff" />
      </mesh>

      {/* Center Pedestal - Sleek Titanium */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.6, 0.8, 1.4, 8]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.2} metalness={0.6} />
      </mesh>

      {/* Levitating Crystal */}
      <mesh ref={crystalRef} position={[0, 2.0, 0]}>
        <octahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={0.8}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* 4 Surrounding Guide Beacons */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, idx) => {
        const radius = 2.4;
        const bx = Math.cos(angle) * radius;
        const bz = Math.sin(angle) * radius;
        return (
          <group key={idx} position={[bx, 0, bz]}>
            <mesh position={[0, 0.5, 0]}>
              <boxGeometry args={[0.2, 1.0, 0.2]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.5} roughness={0.2} />
            </mesh>
            <mesh position={[0, 1.05, 0]}>
              <sphereGeometry args={[0.1, 12, 12]} />
              <meshBasicMaterial color="#00f0ff" />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
