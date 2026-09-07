import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { InteractiveZoneBadge } from './InteractiveZoneBadge';

export function ResumeZone({ position = [0, 0, 14], isNearby, onInteract }) {
  const docRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (docRef.current) {
      docRef.current.rotation.y = t * 0.6;
      docRef.current.position.y = 1.6 + Math.sin(t * 2) * 0.1;
    }
  });

  return (
    <group position={position}>
      <InteractiveZoneBadge
        title="Resume Terminal"
        subtitle="Credentials & CV"
        color="#e2e8f0"
        isNearby={isNearby}
        onInteract={onInteract}
      />

      {/* Terminal Pedestal Base - Clean White Porcelain */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[2.2, 2.5, 0.2, 16]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.3} />
      </mesh>
      {/* Platinum Ring */}
      <mesh position={[0, 0.22, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.9, 2.1, 16]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>

      {/* Modern High-Tech Stand - Sleek Titanium */}
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.4, 0.6, 1.2, 8]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.3} metalness={0.6} />
      </mesh>

      {/* Floating Holographic Document Tablet */}
      <group ref={docRef} position={[0, 1.6, 0]}>
        {/* Document Sheet */}
        <mesh>
          <boxGeometry args={[0.7, 0.95, 0.04]} />
          <meshStandardMaterial
            color="#f8fafc"
            metalness={0.3}
            roughness={0.1}
            emissive="#94a3b8"
            emissiveIntensity={0.3}
          />
        </mesh>
        {/* Holographic Text Bars on Sheet */}
        {[-0.25, -0.1, 0.05, 0.2].map((y, i) => (
          <mesh key={i} position={[0, y, 0.025]}>
            <planeGeometry args={[i === 0 ? 0.45 : 0.55, 0.04]} />
            <meshBasicMaterial color="#0284c7" />
          </mesh>
        ))}
      </group>
    </group>
  );
}
