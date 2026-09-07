import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function IslandWorld() {
  const particlesRef = useRef();
  const waterRef = useRef();
  const cloudsRef = useRef();

  // Procedural tree positions (kept outside zones)
  const treePositions = useMemo(() => {
    const list = [];
    const seedPoints = [
      [-8, -12], [8, -12], [-12, -14], [12, -14],
      [-10, 8], [10, 8], [-8, 20], [8, 20],
      [-22, 4], [-24, -2], [22, 4], [24, -2],
      [-14, -22], [14, -22], [0, -26], [0, 24],
      [-26, 12], [26, 12], [-6, -4], [6, -4]
    ];
    seedPoints.forEach(([x, z], i) => {
      list.push({
        pos: [x + (Math.sin(i) * 1.5), 0, z + (Math.cos(i) * 1.5)],
        scale: 0.8 + (Math.sin(i * 3) * 0.3),
        type: i % 3
      });
    });
    return list;
  }, []);

  // Procedural decorative cyber-crystals
  const crystalPositions = useMemo(() => [
    [-6, 0, -8], [6, 0, -8], [-12, 0, 4], [12, 0, 4],
    [-4, 0, 10], [4, 0, 10], [-20, 0, 8], [20, 0, 8]
  ], []);

  // Pathway connecting segments
  const pathWayPoints = useMemo(() => [
    // Center to About [0, 0, -18]
    { pos: [0, 0.02, -9], size: [2.2, 0.02, 16] },
    // Center to Resume [0, 0, 14]
    { pos: [0, 0.02, 7], size: [2.2, 0.02, 12] },
    // Center to Projects [-18, 0, -6]
    { pos: [-9, 0.02, -3], size: [18, 0.02, 2.0], rot: [0, -0.32, 0] },
    // Center to Skills [18, 0, -6]
    { pos: [9, 0.02, -3], size: [18, 0.02, 2.0], rot: [0, 0.32, 0] },
    // Center to Experience [-16, 0, 16]
    { pos: [-8, 0.02, 8], size: [16, 0.02, 2.0], rot: [0, 0.78, 0] },
    // Center to Contact [16, 0, 16]
    { pos: [8, 0.02, 8], size: [16, 0.02, 2.0], rot: [0, -0.78, 0] }
  ], []);

  // Floating Cyber Particles
  const particleCount = 120;
  const [particleGeo, particleMat] = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 60;
      positions[i + 1] = Math.random() * 12 + 0.5;
      positions[i + 2] = (Math.random() - 0.5) * 60;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: '#00f0ff',
      size: 0.22,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    return [geo, mat];
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Floating particles drift upward
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array;
      for (let i = 1; i < particleCount * 3; i += 3) {
        positions[i] += 0.025;
        if (positions[i] > 14) {
          positions[i] = 0.5;
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      particlesRef.current.rotation.y = t * 0.03;
    }

    // Gentle ocean wave undulation
    if (waterRef.current) {
      waterRef.current.rotation.z = Math.sin(t * 0.2) * 0.02;
    }

    // Drifting clouds
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y = t * 0.02;
    }
  });

  return (
    <group>
      {/* ================= ISLAND TERRAIN ================= */}
      {/* Primary Island Surface Plate - Rich Emerald Grass */}
      <mesh position={[0, -0.25, 0]}>
        <cylinderGeometry args={[36, 38, 0.5, 48]} />
        <meshStandardMaterial color="#059669" roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Inner Turf / Vibrant Spring Biome */}
      <mesh position={[0, 0.01, 0]}>
        <cylinderGeometry args={[34.5, 34.5, 0.04, 48]} />
        <meshStandardMaterial color="#10b981" roughness={0.5} />
      </mesh>

      {/* Stylized Faceted Granite Cliff Rock Base */}
      <mesh position={[0, -7.5, 0]}>
        <coneGeometry args={[38, 14, 18]} rotation={[Math.PI, 0, 0]} />
        <meshStandardMaterial color="#64748b" roughness={0.8} flatShading />
      </mesh>

      {/* Glowing Cyan Perimeter Energy Ring */}
      <mesh position={[0, 0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[35.6, 36.3, 64]} />
        <meshBasicMaterial color="#00f0ff" opacity={0.85} transparent />
      </mesh>

      {/* ================= PATHWAYS ================= */}
      {pathWayPoints.map((path, idx) => (
        <group key={idx}>
          {/* Porcelain Paver Base */}
          <mesh
            position={path.pos}
            rotation={path.rot || [0, 0, 0]}
          >
            <boxGeometry args={path.size} />
            <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.2} />
          </mesh>
          {/* Subtle Glowing Center Strip */}
          <mesh
            position={[path.pos[0], path.pos[1] + 0.02, path.pos[2]]}
            rotation={path.rot || [0, 0, 0]}
          >
            <boxGeometry args={[
              path.size[0] > path.size[2] ? path.size[0] : 0.18,
              0.02,
              path.size[2] > path.size[0] ? path.size[2] : 0.18
            ]} />
            <meshBasicMaterial color="#00f0ff" opacity={0.7} transparent />
          </mesh>
        </group>
      ))}

      {/* ================= TREES ================= */}
      {treePositions.map((tree, i) => (
        <group key={i} position={tree.pos} scale={tree.scale}>
          {/* Warm Cedar Trunk */}
          <mesh position={[0, 1.0, 0]}>
            <cylinderGeometry args={[0.2, 0.35, 2.0, 6]} />
            <meshStandardMaterial color="#854d0e" roughness={0.8} />
          </mesh>
          {/* Foliage Cones */}
          <mesh position={[0, 2.4, 0]}>
            <coneGeometry args={[1.3, 1.8, 6]} />
            <meshStandardMaterial
              color={tree.type === 0 ? "#10b981" : (tree.type === 1 ? "#06b6d4" : "#14b8a6")}
              roughness={0.4}
              flatShading
            />
          </mesh>
          <mesh position={[0, 3.4, 0]}>
            <coneGeometry args={[1.0, 1.5, 6]} />
            <meshStandardMaterial
              color={tree.type === 0 ? "#34d399" : (tree.type === 1 ? "#38bdf8" : "#2dd4bf")}
              roughness={0.4}
              flatShading
            />
          </mesh>
        </group>
      ))}

      {/* ================= DECORATIVE CYBER CRYSTALS ================= */}
      {crystalPositions.map((pos, idx) => (
        <group key={idx} position={pos}>
          <mesh position={[0, 0.4, 0]} rotation={[0.2, idx, 0.1]}>
            <octahedronGeometry args={[0.45, 0]} />
            <meshStandardMaterial
              color="#00f0ff"
              emissive="#00f0ff"
              emissiveIntensity={0.8}
              roughness={0.1}
            />
          </mesh>
        </group>
      ))}

      {/* ================= STREET LAMPS ================= */}
      {[
        [-5, 0, -4], [5, 0, -4],
        [-5, 0, 4], [5, 0, 4],
        [0, 0, -12], [0, 0, 10],
        [-10, 0, -5], [10, 0, -5],
        [-9, 0, 9], [9, 0, 9]
      ].map(([lx, ly, lz], i) => (
        <group key={i} position={[lx, ly, lz]}>
          <mesh position={[0, 1.4, 0]}>
            <cylinderGeometry args={[0.06, 0.08, 2.8, 8]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.6} roughness={0.3} />
          </mesh>
          {/* Lamp Head */}
          <mesh position={[0, 2.8, 0]}>
            <boxGeometry args={[0.35, 0.15, 0.35]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
          {/* Glowing Bulb */}
          <mesh position={[0, 2.65, 0]}>
            <sphereGeometry args={[0.14, 12, 12]} />
            <meshBasicMaterial color="#00f0ff" />
          </mesh>
          {/* Subtle Local Point Light */}
          <pointLight position={[0, 2.5, 0]} intensity={1.0} distance={8} color="#00f0ff" />
        </group>
      ))}

      {/* ================= FLOATING DISTANT ISLETS ================= */}
      {[
        [-55, -4, -40],
        [50, -2, -45],
        [-45, -6, 50],
        [55, -3, 40]
      ].map(([ix, iy, iz], idx) => (
        <group key={idx} position={[ix, iy, iz]}>
          <mesh>
            <cylinderGeometry args={[10, 11, 2, 8]} />
            <meshStandardMaterial color="#10b981" roughness={0.7} />
          </mesh>
          <mesh position={[0, -4, 0]}>
            <coneGeometry args={[11, 8, 8]} rotation={[Math.PI, 0, 0]} />
            <meshStandardMaterial color="#64748b" roughness={0.9} flatShading />
          </mesh>
          {/* Beacon on islet */}
          <mesh position={[0, 2, 0]}>
            <octahedronGeometry args={[1.2, 0]} />
            <meshStandardMaterial
              color="#00f0ff"
              emissive="#00f0ff"
              emissiveIntensity={0.8}
            />
          </mesh>
        </group>
      ))}

      {/* ================= FLOATING CLOUDS ================= */}
      <group ref={cloudsRef} position={[0, 22, 0]}>
        {[
          [-30, 0, -25], [35, 2, -30], [-25, -1, 35], [30, 1, 28]
        ].map(([cx, cy, cz], idx) => (
          <mesh key={idx} position={[cx, cy, cz]}>
            <sphereGeometry args={[8, 12, 12]} />
            <meshStandardMaterial
              color="#ffffff"
              transparent
              opacity={0.85}
              roughness={0.9}
            />
          </mesh>
        ))}
      </group>

      {/* ================= FLOATING PARTICLES ================= */}
      <points ref={particlesRef} geometry={particleGeo} material={particleMat} />

      {/* ================= VIBRANT TROPICAL AZURE OCEAN ================= */}
      <mesh ref={waterRef} position={[0, -18, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[700, 700, 32, 32]} />
        <meshStandardMaterial
          color="#0284c7"
          roughness={0.1}
          metalness={0.4}
        />
      </mesh>
    </group>
  );
}
