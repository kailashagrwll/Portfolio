import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { InteractiveZoneBadge } from './InteractiveZoneBadge';

export function SkillsZone({ position = [18, 0, -6], isNearby, onInteract }) {
  const crystalGroupRef = useRef();

  useFrame((state) => {
    if (crystalGroupRef.current) {
      const t = state.clock.getElapsedTime();
      crystalGroupRef.current.rotation.y = t * 0.35;
    }
  });

  const skillPillars = [
    { color: '#00f0ff', label: '3D Graphics', angle: 0 },
    { color: '#ff007f', label: 'Frontend', angle: Math.PI / 2 },
    { color: '#00ff88', label: 'Backend', angle: Math.PI },
    { color: '#ffb800', label: 'Cloud & Tools', angle: (3 * Math.PI) / 2 }
  ];

  return (
    <group position={position}>
      <InteractiveZoneBadge
        title="Skills Arena"
        subtitle="Technical Arsenal"
        color="#ff007f"
        isNearby={isNearby}
        onInteract={onInteract}
      />

      {/* Hexagonal Arena Foundation */}
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[4.2, 4.6, 0.24, 6]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.2} />
      </mesh>
      {/* Neon glowing edge */}
      <mesh position={[0, 0.26, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.8, 4.0, 6]} />
        <meshBasicMaterial color="#ff007f" />
      </mesh>

      {/* Center Levitating Monolith */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.9, 1.2, 1.4, 6]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.2} metalness={0.6} />
      </mesh>

      {/* Rotating 4 Skill Crystal Pillars */}
      <group ref={crystalGroupRef} position={[0, 1.8, 0]}>
        {skillPillars.map((p, idx) => {
          const dist = 2.4;
          const px = Math.cos(p.angle) * dist;
          const pz = Math.sin(p.angle) * dist;

          return (
            <group key={idx} position={[px, 0, pz]}>
              {/* Pillar Base */}
              <mesh position={[0, -0.6, 0]}>
                <boxGeometry args={[0.4, 1.2, 0.4]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.6} roughness={0.2} />
              </mesh>
              {/* Floating Floating Crystal Core */}
              <mesh position={[0, 0.4, 0]}>
                <octahedronGeometry args={[0.35, 0]} />
                <meshStandardMaterial
                  color={p.color}
                  emissive={p.color}
                  emissiveIntensity={0.8}
                  roughness={0.1}
                />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
}
