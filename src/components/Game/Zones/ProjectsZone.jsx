import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { InteractiveZoneBadge } from './InteractiveZoneBadge';

export function ProjectsZone({ position = [-18, 0, -6], isNearby, onInteract }) {
  const screensRef = useRef();

  useFrame((state) => {
    if (screensRef.current) {
      screensRef.current.rotation.y = state.clock.getElapsedTime() * 0.25;
    }
  });

  return (
    <group position={position}>
      <InteractiveZoneBadge
        title="Projects Lab"
        subtitle="Innovation Bay"
        color="#00ff88"
        isNearby={isNearby}
        onInteract={onInteract}
      />

      {/* Lab Base Platform - Clean White with Emerald Accent */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[7.2, 0.2, 7.2]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.3} />
      </mesh>
      {/* Grid line frame */}
      <mesh position={[0, 0.22, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.2, 3.4, 4]} rotation={[0, 0, Math.PI / 4]} />
        <meshBasicMaterial color="#10b981" />
      </mesh>

      {/* 2 Server Racks on back edge - Clean High-Tech White */}
      {[-2.5, 2.5].map((x, i) => (
        <group key={i} position={[x, 0, -2.6]}>
          <mesh position={[0, 1.5, 0]}>
            <boxGeometry args={[1.2, 2.8, 0.8]} />
            <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.5} />
          </mesh>
          {/* Glowing Server Indicator Lights */}
          {[0.6, 1.1, 1.6, 2.1].map((ly, li) => (
            <mesh key={li} position={[0, ly, 0.42]}>
              <boxGeometry args={[0.9, 0.08, 0.04]} />
              <meshBasicMaterial color={li % 2 === 0 ? "#10b981" : "#00ff88"} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Main Terminal Desk */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[1.4, 1.6, 1.0, 8]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.6} roughness={0.2} />
      </mesh>

      {/* Orbiting Holographic Screens */}
      <group ref={screensRef} position={[0, 1.8, 0]}>
        {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, idx) => {
          const dist = 1.6;
          const sx = Math.cos(angle) * dist;
          const sz = Math.sin(angle) * dist;
          return (
            <group key={idx} position={[sx, 0, sz]} rotation={[0, -angle + Math.PI / 2, 0]}>
              {/* Screen Display Frame */}
              <mesh>
                <boxGeometry args={[1.1, 0.7, 0.04]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.7} roughness={0.2} />
              </mesh>
              {/* Glowing Holographic Face */}
              <mesh position={[0, 0, 0.03]}>
                <planeGeometry args={[1.0, 0.6]} />
                <meshBasicMaterial color="#00ff88" opacity={0.9} transparent />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
}
