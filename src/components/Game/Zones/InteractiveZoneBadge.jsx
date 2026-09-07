import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

export function InteractiveZoneBadge({
  title,
  subtitle,
  color = '#00f0ff',
  isNearby = false,
  onInteract
}) {
  const markerRef = useRef();

  useFrame((state) => {
    if (!markerRef.current) return;
    const t = state.clock.getElapsedTime();
    markerRef.current.position.y = 3.6 + Math.sin(t * 2.5) * 0.18;
    markerRef.current.rotation.y = t * 0.8;
  });

  return (
    <group position={[0, 0, 0]}>
      {/* 3D Floating Diamond Icon */}
      <group ref={markerRef} position={[0, 3.6, 0]}>
        <mesh>
          <octahedronGeometry args={[0.38, 0]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={isNearby ? 0.9 : 0.4}
            roughness={0.2}
            metalness={0.8}
            wireframe={!isNearby}
          />
        </mesh>
      </group>

      {/* Pulsing Ground Ring */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.8, 3.1, 32]} />
        <meshBasicMaterial
          color={color}
          opacity={isNearby ? 0.85 : 0.35}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* HTML floating UI tag rendered smoothly in 3D space */}
      <Html
        position={[0, 4.4, 0]}
        center
        distanceFactor={18}
        zIndexRange={[100, 0]}
        style={{ pointerEvents: isNearby ? 'auto' : 'none', transition: 'all 0.3s ease' }}
      >
        <div
          onClick={isNearby ? onInteract : undefined}
          style={{
            background: isNearby ? 'rgba(10, 15, 30, 0.88)' : 'rgba(10, 15, 30, 0.6)',
            border: `1px solid ${isNearby ? color : 'rgba(255,255,255,0.2)'}`,
            borderRadius: '10px',
            padding: '6px 14px',
            color: '#fff',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            textAlign: 'center',
            backdropFilter: 'blur(8px)',
            boxShadow: isNearby ? `0 0 20px ${color}66` : '0 4px 12px rgba(0,0,0,0.5)',
            transform: isNearby ? 'scale(1.08)' : 'scale(0.95)',
            cursor: isNearby ? 'pointer' : 'default',
            whiteSpace: 'nowrap',
            userSelect: 'none'
          }}
        >
          <div style={{ fontSize: '13px', fontWeight: 'bold', color: color, letterSpacing: '0.05em' }}>
            {title}
          </div>
          {isNearby ? (
            <div style={{
              fontSize: '11px',
              marginTop: '3px',
              color: '#fff',
              background: color,
              padding: '2px 8px',
              borderRadius: '4px',
              fontWeight: 700,
              display: 'inline-block',
              textTransform: 'uppercase'
            }}>
              Press [E] or Click
            </div>
          ) : (
            <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>
              {subtitle}
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}
