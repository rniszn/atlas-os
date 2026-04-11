import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  MeshDistortMaterial,
  Text,
  ContactShadows,
  Environment,
} from '@react-three/drei';

/**
 * @param {{
 *   setActiveModule: (m: 'tasks' | 'ai' | 'music') => void;
 *   setPointerInteractiveHover: (v: boolean) => void;
 * }} props
 */
export default function Experience({ setActiveModule, setPointerInteractiveHover }) {
  const monolithRef = useRef(null);
  const oracleGroupRef = useRef(null);
  const deskGroupRef = useRef(null);

  const bindInteractive = {
    onPointerOver: (e) => {
      e.stopPropagation();
      setPointerInteractiveHover(true);
      document.body.style.cursor = 'none';
    },
    onPointerOut: (e) => {
      e.stopPropagation();
      setPointerInteractiveHover(false);
      document.body.style.cursor = 'none';
    },
  };

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (monolithRef.current) {
      monolithRef.current.rotation.y += delta * 0.38;
      monolithRef.current.rotation.x = Math.sin(t * 0.72) * 0.09;
    }
    if (oracleGroupRef.current) {
      oracleGroupRef.current.position.y = 1.42 + Math.sin(t * 1.45) * 0.14;
      oracleGroupRef.current.rotation.y = Math.sin(t * 0.5) * 0.15;
    }
    if (deskGroupRef.current) {
      deskGroupRef.current.rotation.y = Math.sin(t * 0.22) * 0.045;
    }
  });

  return (
    <>
      <color attach="background" args={['#020617']} />
      <fog attach="fog" args={['#020617', 14, 42]} />

      <ambientLight intensity={0.22} />
      <hemisphereLight args={['#1e293b', '#0f172a', 0.35]} />
      <directionalLight
        castShadow
        position={[10, 16, 8]}
        intensity={1.15}
        color="#f8fafc"
        shadowBias={-0.0004}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={48}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={14}
        shadow-camera-bottom={-14}
      />
      <directionalLight position={[-8, 6, -6]} intensity={0.35} color="#38bdf8" />
      <pointLight position={[-5, 4, 4]} intensity={0.45} color="#67e8f9" distance={18} decay={2} />
      <pointLight position={[6, 3, 5]} intensity={0.35} color="#c4b5fd" distance={16} decay={2} />

      <Environment preset="city" />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[56, 56]} />
        <meshStandardMaterial color="#060b18" metalness={0.35} roughness={0.92} />
      </mesh>

      {/* —— Glass Command Desk —— */}
      <group
        ref={deskGroupRef}
        position={[2.35, 0, 0.2]}
        onClick={(e) => {
          e.stopPropagation();
          setActiveModule('tasks');
        }}
        {...bindInteractive}
      >
        <mesh castShadow receiveShadow position={[0, 0.44, 0]}>
          <boxGeometry args={[2.5, 0.09, 1.4]} />
          <meshPhysicalMaterial
            color="#e0f2fe"
            metalness={0.02}
            roughness={0.08}
            transmission={0.94}
            thickness={0.65}
            ior={1.47}
            attenuationColor="#0ea5e9"
            attenuationDistance={0.85}
            transparent
            envMapIntensity={1.1}
          />
        </mesh>
        {[
          [-0.9, 0.2, 0.48],
          [0.9, 0.2, 0.48],
          [-0.9, 0.2, -0.48],
          [0.9, 0.2, -0.48],
        ].map((p, i) => (
          <mesh key={i} castShadow position={p}>
            <cylinderGeometry args={[0.065, 0.085, 0.42, 24]} />
            <meshStandardMaterial color="#0f172a" metalness={0.75} roughness={0.28} />
          </mesh>
        ))}
        <Text
          position={[0, 0.92, 0]}
          fontSize={0.2}
          color="#f1f5f9"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.06}
        >
          COMMAND DESK
        </Text>
      </group>

      {/* —— AI Robot (distorted sphere + optics) —— */}
      <group
        ref={oracleGroupRef}
        position={[-2.55, 1.42, 0.35]}
        onClick={(e) => {
          e.stopPropagation();
          setActiveModule('ai');
        }}
        {...bindInteractive}
      >
        <mesh castShadow>
          <sphereGeometry args={[0.52, 64, 64]} />
          <MeshDistortMaterial
            color="#a5b4fc"
            emissive="#312e81"
            emissiveIntensity={0.4}
            roughness={0.18}
            metalness={0.45}
            distort={0.42}
            speed={2.4}
            radius={1}
          />
        </mesh>
        <mesh position={[0.18, 0.12, 0.42]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.14, 0.08, 0.06]} />
          <meshStandardMaterial color="#22d3ee" emissive="#0891b2" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[-0.18, 0.12, 0.42]}>
          <boxGeometry args={[0.14, 0.08, 0.06]} />
          <meshStandardMaterial color="#22d3ee" emissive="#0891b2" emissiveIntensity={0.8} />
        </mesh>
        <pointLight position={[0, 0.1, 0.6]} intensity={0.35} distance={2.5} color="#a5b4fc" />
        <Text
          position={[0, 0.92, 0]}
          fontSize={0.17}
          color="#e2e8f0"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.08}
        >
          AI ROBOT
        </Text>
      </group>

      {/* —— Audio Core —— */}
      <group
        position={[0, 1.15, -2.35]}
        onClick={(e) => {
          e.stopPropagation();
          setActiveModule('music');
        }}
        {...bindInteractive}
      >
        <mesh ref={monolithRef} castShadow>
          <octahedronGeometry args={[0.68, 0]} />
          <meshStandardMaterial
            color="#34d399"
            metalness={0.88}
            roughness={0.12}
            emissive="#022c22"
            emissiveIntensity={0.35}
          />
        </mesh>
        <mesh position={[0, 0, 0]} scale={1.08}>
          <octahedronGeometry args={[0.68, 0]} />
          <meshBasicMaterial color="#6ee7b7" wireframe transparent opacity={0.12} />
        </mesh>
        <Text
          position={[0, 1.08, 0]}
          fontSize={0.17}
          color="#ecfdf5"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.08}
        >
          AUDIO CORE
        </Text>
      </group>

      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.5}
        scale={16}
        blur={2.8}
        far={5.5}
        color="#000000"
      />
    </>
  );
}
