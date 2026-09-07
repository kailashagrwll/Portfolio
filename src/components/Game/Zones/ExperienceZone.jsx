import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { InteractiveZoneBadge } from './InteractiveZoneBadge';

export function ExperienceZone({ position = [-16, 0, 16], isNearby, onInteract }) {
  const ringsRef = useRef();

  useFrame((state) => {
    if (ringsRef.current) {
      ringsRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <group position={position}>
      <InteractiveZoneBadge
        title="Experience Museum"
        subtitle="Chronology & Milestones"
        color="#ffb800"
        isNearby={isNearby}
        onInteract={onInteract}
      />

      {/* Museum Walkway Foundation - White Marble & Gold */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[7.0, 0.2, 5.0]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.3} />
      </mesh>
      {/* Gold outline border */}
      <mesh position={[0, 0.22, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.6, 2.8, 4]} rotation={[0, 0, Math.PI / 4]} />
        <meshBasicMaterial color="#ffb800" />
      </mesh>

      {/* 3 Chrono-Display Pedestals - Sleek Titanium & Gold */}
      {[-2.0, 0, 2.0].map((x, idx) => (
        <group key={idx} position={[x, 0, 0]}>
          {/* Pedestal cylinder */}
          <mesh position={[0, 0.7, 0]}>
            <cylinderGeometry args={[0.5, 0.6, 1.2, 16]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.6} roughness={0.2} />
          </mesh>
          {/* Glass case dome */}
          <mesh position={[0, 1.6, 0]}>
            <cylinderGeometry args={[0.4, 0.4, 0.7, 16]} />
            <meshStandardMaterial
              color="#fef08a"
              roughness={0.1}
              metalness={0.9}
              transparent
              opacity={0.45}
            />
          </mesh>
          {/* Floating milestone artifact inside */}
          <mesh position={[0, 1.6, 0]}>
            <dodecahedronGeometry args={[0.18, 0]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#d97706"
              emissiveIntensity={0.8}
            />
          </mesh>
        </group>
      ))}

      {/* Central Rotating Archway / Chrono Ring */}
      <group ref={ringsRef} position={[0, 2.6, 0]}>
        <mesh rotation={[0, 0, 0]}>
          <torusGeometry args={[1.6, 0.05, 12, 36]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>
      </group>
    </group>
  );
}
