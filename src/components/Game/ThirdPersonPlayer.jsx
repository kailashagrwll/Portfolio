import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { soundManager } from '../../audio/soundManager';

export function ThirdPersonPlayer({
  movement,
  playerPosRef,
  onPositionUpdate,
  cameraTargetRef,
  teleportTarget,
  onTeleportComplete
}) {
  const groupRef = useRef();
  const leftLegRef = useRef();
  const rightLegRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const thrusterRef = useRef();

  // Physics state
  const pos = useRef(new THREE.Vector3(0, 0, 0));
  const velY = useRef(0);
  const isGrounded = useRef(true);
  const rotationY = useRef(0);
  const targetRotationY = useRef(0);
  const walkTime = useRef(0);
  const footstepCooldown = useRef(0);

  // Handle external teleport requests
  useEffect(() => {
    if (teleportTarget) {
      pos.current.set(teleportTarget[0], teleportTarget[1] || 0, teleportTarget[2]);
      velY.current = 0;
      isGrounded.current = true;
      if (groupRef.current) {
        groupRef.current.position.copy(pos.current);
      }
      soundManager.playTeleport();
      if (onTeleportComplete) onTeleportComplete();
    }
  }, [teleportTarget, onTeleportComplete]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Constrain delta to prevent huge jumps on tab switches
    const dt = Math.min(delta, 0.1);

    const { forward, backward, left, right, sprint, jump, analogVector } = movement;

    // Movement speeds
    const baseSpeed = sprint ? 13.5 : 7.8;
    let moveX = 0;
    let moveZ = 0;
    let inputMagnitude = 1;

    if (analogVector && (Math.abs(analogVector.x) > 0.06 || Math.abs(analogVector.y) > 0.06)) {
      moveX = analogVector.x;
      moveZ = analogVector.y;
      inputMagnitude = Math.min(1, Math.hypot(moveX, moveZ));
    } else {
      moveX = (right ? 1 : 0) - (left ? 1 : 0);
      moveZ = (backward ? 1 : 0) - (forward ? 1 : 0);
      inputMagnitude = (moveX !== 0 || moveZ !== 0) ? 1 : 0;
    }

    const isMoving = inputMagnitude > 0.06;

    // Handle horizontal movement
    if (isMoving) {
      const inputVector = new THREE.Vector3(moveX, 0, moveZ).normalize();
      targetRotationY.current = Math.atan2(inputVector.x, inputVector.z);

      const moveStep = inputVector.multiplyScalar(baseSpeed * inputMagnitude * dt);
      pos.current.x += moveStep.x;
      pos.current.z += moveStep.z;

      // Animate limbs
      const animFreq = sprint ? 16 : 10;
      walkTime.current += dt * animFreq;

      const legAngle = Math.sin(walkTime.current) * (sprint ? 0.75 : 0.5);
      const armAngle = Math.sin(walkTime.current) * (sprint ? 0.65 : 0.4);

      if (leftLegRef.current) leftLegRef.current.rotation.x = legAngle;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -legAngle;
      if (leftArmRef.current) leftArmRef.current.rotation.x = -armAngle;
      if (rightArmRef.current) rightArmRef.current.rotation.x = armAngle;

      // Footstep sound
      footstepCooldown.current -= dt;
      if (isGrounded.current && footstepCooldown.current <= 0) {
        soundManager.playFootstep();
        footstepCooldown.current = sprint ? 0.22 : 0.36;
      }
    } else {
      // Idle pose lerp
      if (leftLegRef.current) leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, 0, 0.2);
      if (rightLegRef.current) rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, 0, 0.2);
      if (leftArmRef.current) leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, 0, 0.2);
      if (rightArmRef.current) rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, 0, 0.2);
    }

    // Smooth character rotation
    let rotDiff = targetRotationY.current - rotationY.current;
    while (rotDiff < -Math.PI) rotDiff += Math.PI * 2;
    while (rotDiff > Math.PI) rotDiff -= Math.PI * 2;
    rotationY.current += rotDiff * Math.min(1, 14 * dt);
    groupRef.current.rotation.y = rotationY.current;

    // Jump & Gravity Physics
    const gravity = -26;
    if (jump && isGrounded.current) {
      velY.current = 10.5;
      isGrounded.current = false;
      soundManager.playJump();
    }

    if (!isGrounded.current) {
      velY.current += gravity * dt;
      pos.current.y += velY.current * dt;

      // Island ground level check
      if (pos.current.y <= 0) {
        pos.current.y = 0;
        velY.current = 0;
        isGrounded.current = true;
      }
    }

    // Island boundary check (Radius 36)
    const distFromCenter = Math.sqrt(pos.current.x * pos.current.x + pos.current.z * pos.current.z);
    const maxRadius = 36;
    if (distFromCenter > maxRadius) {
      const angle = Math.atan2(pos.current.z, pos.current.x);
      pos.current.x = Math.cos(angle) * maxRadius;
      pos.current.z = Math.sin(angle) * maxRadius;
    }

    // Jet thruster glow
    if (thrusterRef.current) {
      const targetScale = sprint ? 1.6 : (isMoving ? 1.0 : 0.4);
      thrusterRef.current.scale.set(1, THREE.MathUtils.lerp(thrusterRef.current.scale.y, targetScale, 0.15), 1);
    }

    // Apply position
    groupRef.current.position.copy(pos.current);

    // Sync external refs
    if (playerPosRef) {
      playerPosRef.current = pos.current;
    }
    if (cameraTargetRef) {
      cameraTargetRef.current = pos.current.clone().add(new THREE.Vector3(0, 1.4, 0));
    }
    if (onPositionUpdate) {
      onPositionUpdate(pos.current);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Character Root (Origin at feet) */}
      <group position={[0, 0, 0]}>
        {/* Shadow disc */}
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.55, 24]} />
          <meshBasicMaterial color="#000000" opacity={0.4} transparent />
        </mesh>

        {/* Pelvis / Hip */}
        <mesh position={[0, 0.85, 0]}>
          <boxGeometry args={[0.42, 0.22, 0.28]} />
          <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.8} />
        </mesh>

        {/* Ground Contact Shadow */}
        <mesh position={[0, -0.78, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.55, 24]} />
          <meshBasicMaterial color="#000000" opacity={0.32} transparent />
        </mesh>

        {/* Torso / Cyber Armor */}
        <mesh position={[0, 1.22, 0]}>
          <boxGeometry args={[0.5, 0.55, 0.32]} />
          <meshStandardMaterial color="#2563eb" roughness={0.3} metalness={0.4} />
        </mesh>

        {/* Chest Energy Core */}
        <mesh position={[0, 1.25, 0.17]}>
          <cylinderGeometry args={[0.09, 0.09, 0.05, 16]} rotation={[Math.PI / 2, 0, 0]} />
          <meshBasicMaterial color="#00f0ff" />
        </mesh>

        {/* Backpack Jet Thruster */}
        <group position={[0, 1.25, -0.22]}>
          <mesh>
            <boxGeometry args={[0.3, 0.42, 0.16]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.4} metalness={0.6} />
          </mesh>
          {/* Dual Thruster Nozzles */}
          <mesh position={[-0.09, -0.22, 0]}>
            <cylinderGeometry args={[0.045, 0.06, 0.12, 12]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
          <mesh position={[0.09, -0.22, 0]}>
            <cylinderGeometry args={[0.045, 0.06, 0.12, 12]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
          {/* Flame exhaust */}
          <mesh ref={thrusterRef} position={[0, -0.32, 0]}>
            <coneGeometry args={[0.1, 0.3, 12]} rotation={[Math.PI, 0, 0]} />
            <meshBasicMaterial color="#00f0ff" opacity={0.9} transparent />
          </mesh>
        </group>

        {/* Head & Helmet - Clean High-Visibility White */}
        <group position={[0, 1.68, 0]}>
          <mesh>
            <sphereGeometry args={[0.22, 20, 20]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.3} />
          </mesh>
          {/* Glowing Visor */}
          <mesh position={[0, 0.02, 0.16]} rotation={[0.15, 0, 0]}>
            <boxGeometry args={[0.28, 0.12, 0.12]} />
            <meshBasicMaterial color="#00f0ff" />
          </mesh>
          {/* Antenna beacon */}
          <mesh position={[0.12, 0.22, -0.05]}>
            <cylinderGeometry args={[0.015, 0.015, 0.18]} />
            <meshStandardMaterial color="#94a3b8" />
          </mesh>
          <mesh position={[0.12, 0.32, -0.05]}>
            <sphereGeometry args={[0.035, 8, 8]} />
            <meshBasicMaterial color="#00ff88" />
          </mesh>
        </group>

        {/* Left Arm */}
        <group ref={leftArmRef} position={[-0.32, 1.42, 0]}>
          <mesh position={[0, -0.25, 0]}>
            <capsuleGeometry args={[0.07, 0.34, 4, 8]} />
            <meshStandardMaterial color="#3b82f6" roughness={0.3} />
          </mesh>
          {/* Hand glove */}
          <mesh position={[0, -0.46, 0]}>
            <sphereGeometry args={[0.075, 10, 10]} />
            <meshStandardMaterial color="#00f0ff" roughness={0.4} />
          </mesh>
        </group>

        {/* Right Arm */}
        <group ref={rightArmRef} position={[0.32, 1.42, 0]}>
          <mesh position={[0, -0.25, 0]}>
            <capsuleGeometry args={[0.07, 0.34, 4, 8]} />
            <meshStandardMaterial color="#3b82f6" roughness={0.3} />
          </mesh>
          {/* Hand glove */}
          <mesh position={[0, -0.46, 0]}>
            <sphereGeometry args={[0.075, 10, 10]} />
            <meshStandardMaterial color="#00f0ff" roughness={0.4} />
          </mesh>
        </group>

        {/* Left Leg */}
        <group ref={leftLegRef} position={[-0.14, 0.8, 0]}>
          <mesh position={[0, -0.38, 0]}>
            <capsuleGeometry args={[0.08, 0.44, 4, 8]} />
            <meshStandardMaterial color="#1e293b" roughness={0.4} />
          </mesh>
          {/* Sneaker */}
          <mesh position={[0, -0.68, 0.04]}>
            <boxGeometry args={[0.15, 0.14, 0.24]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} />
          </mesh>
        </group>

        {/* Right Leg */}
        <group ref={rightLegRef} position={[0.14, 0.8, 0]}>
          <mesh position={[0, -0.38, 0]}>
            <capsuleGeometry args={[0.08, 0.44, 4, 8]} />
            <meshStandardMaterial color="#1e293b" roughness={0.4} />
          </mesh>
          {/* Sneaker */}
          <mesh position={[0, -0.68, 0.04]}>
            <boxGeometry args={[0.15, 0.14, 0.24]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
