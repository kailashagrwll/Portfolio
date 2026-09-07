import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { IslandWorld } from './IslandWorld';
import { ThirdPersonPlayer } from './ThirdPersonPlayer';
import { SpawnZone } from './Zones/SpawnZone';
import { AboutZone } from './Zones/AboutZone';
import { ProjectsZone } from './Zones/ProjectsZone';
import { SkillsZone } from './Zones/SkillsZone';
import { ExperienceZone } from './Zones/ExperienceZone';
import { ContactZone } from './Zones/ContactZone';
import { ResumeZone } from './Zones/ResumeZone';
import { portfolioData } from '../../data/portfolio';
import { soundManager } from '../../audio/soundManager';

// Camera Rig Component
function CameraController({ mode, targetPos, isInteracting }) {
  const cameraAngle = useRef(0);
  const mouseLookOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (mode !== 'game' || isInteracting) return;
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      mouseLookOffset.current.x = nx * 1.5;
      mouseLookOffset.current.y = ny * 0.8;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mode, isInteracting]);

  useFrame((state, delta) => {
    const camera = state.camera;
    const dt = Math.min(delta, 0.1);

    if (mode === 'intro') {
      // Cinematic slow orbit
      cameraAngle.current += dt * 0.18;
      const radius = 38;
      const height = 22;
      camera.position.x = Math.sin(cameraAngle.current) * radius;
      camera.position.z = Math.cos(cameraAngle.current) * radius;
      camera.position.y = height;
      camera.lookAt(0, 3, 0);
    } else {
      // Third-person smooth follow behind player
      const p = targetPos.current || new THREE.Vector3(0, 1.4, 0);
      const idealOffset = new THREE.Vector3(
        mouseLookOffset.current.x * 2.5,
        5.8 - mouseLookOffset.current.y * 1.5,
        9.2
      );
      const desiredPos = p.clone().add(idealOffset);

      camera.position.lerp(desiredPos, Math.min(1, dt * 5.0));

      const lookTarget = p.clone().add(new THREE.Vector3(0, 0.6, 0));
      camera.lookAt(lookTarget);
    }
  });

  return null;
}

export function GameCanvas({
  gameStarted,
  movement,
  activeModal,
  onInteractZone,
  nearbyZone,
  setNearbyZone,
  onPlayerPositionChange,
  teleportTarget,
  onTeleportComplete
}) {
  const playerPosRef = useRef(new THREE.Vector3(0, 0, 0));
  const cameraTargetRef = useRef(new THREE.Vector3(0, 1.4, 0));
  const previousZoneRef = useRef(null);

  // Check proximity to all zones
  const handlePositionUpdate = (pos) => {
    if (onPlayerPositionChange) {
      onPlayerPositionChange(pos);
    }

    let closest = null;
    let minDistance = 4.2;

    portfolioData.zones.forEach((zone) => {
      const zPos = new THREE.Vector3(...zone.position);
      const dist = pos.distanceTo(zPos);
      if (dist < minDistance) {
        closest = zone;
        minDistance = dist;
      }
    });

    if (closest?.id !== nearbyZone?.id) {
      setNearbyZone(closest);
      if (closest && closest.id !== previousZoneRef.current) {
        soundManager.playProximityChime();
        previousZoneRef.current = closest.id;
      }
    }
  };

  // Keyboard trigger [E]
  useEffect(() => {
    if (movement.interact && nearbyZone && !activeModal) {
      onInteractZone(nearbyZone);
    }
  }, [movement.interact, nearbyZone, activeModal, onInteractZone]);

  return (
    <Canvas
      shadows
      camera={{ position: [0, 20, 35], fov: 50, near: 0.1, far: 1000 }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: '#7dd3fc'
      }}
    >
      {/* Luminous Sky & Atmospheric Fog */}
      <color attach="background" args={['#7dd3fc']} />
      <fog attach="fog" args={['#bae6fd', 45, 160]} />

      {/* Daylight & Global Illumination */}
      <ambientLight intensity={1.3} color="#ffffff" />
      <hemisphereLight args={['#e0f2fe', '#bbf7d0', 1.0]} />
      <directionalLight
        position={[35, 65, 30]}
        intensity={2.2}
        color="#fffbeb"
        castShadow
      />
      {/* Cyber Neon Key Lights */}
      <pointLight position={[0, 14, 0]} intensity={2.5} distance={55} color="#00f0ff" />
      <pointLight position={[-18, 10, -6]} intensity={2.0} distance={30} color="#10b981" />
      <pointLight position={[18, 10, -6]} intensity={2.0} distance={30} color="#ec4899" />
      <pointLight position={[0, 10, -18]} intensity={2.0} distance={30} color="#a855f7" />
      <pointLight position={[-16, 10, 16]} intensity={2.0} distance={30} color="#f59e0b" />
      <pointLight position={[16, 10, 16]} intensity={2.0} distance={30} color="#06b6d4" />

      {/* Camera Rig */}
      <CameraController
        mode={gameStarted ? 'game' : 'intro'}
        targetPos={cameraTargetRef}
        isInteracting={Boolean(activeModal)}
      />

      {/* World Elements */}
      <IslandWorld />

      {/* 3D Character */}
      {gameStarted && (
        <ThirdPersonPlayer
          movement={movement}
          playerPosRef={playerPosRef}
          cameraTargetRef={cameraTargetRef}
          onPositionUpdate={handlePositionUpdate}
          teleportTarget={teleportTarget}
          onTeleportComplete={onTeleportComplete}
        />
      )}

      {/* Interactive Zones */}
      <SpawnZone
        isNearby={nearbyZone?.id === 'spawn'}
        onInteract={() => onInteractZone(portfolioData.zones.find((z) => z.id === 'spawn'))}
      />
      <AboutZone
        isNearby={nearbyZone?.id === 'about'}
        onInteract={() => onInteractZone(portfolioData.zones.find((z) => z.id === 'about'))}
      />
      <ProjectsZone
        isNearby={nearbyZone?.id === 'projects'}
        onInteract={() => onInteractZone(portfolioData.zones.find((z) => z.id === 'projects'))}
      />
      <SkillsZone
        isNearby={nearbyZone?.id === 'skills'}
        onInteract={() => onInteractZone(portfolioData.zones.find((z) => z.id === 'skills'))}
      />
      <ExperienceZone
        isNearby={nearbyZone?.id === 'experience'}
        onInteract={() => onInteractZone(portfolioData.zones.find((z) => z.id === 'experience'))}
      />
      <ContactZone
        isNearby={nearbyZone?.id === 'contact'}
        onInteract={() => onInteractZone(portfolioData.zones.find((z) => z.id === 'contact'))}
      />
      <ResumeZone
        isNearby={nearbyZone?.id === 'resume'}
        onInteract={() => onInteractZone(portfolioData.zones.find((z) => z.id === 'resume'))}
      />
    </Canvas>
  );
}
