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
 *   setActiveModule: (m: 'tasks' | 'ai' | 'music' | 'career' | 'curriculum' | 'zen' | 'tracker') => void;
 *   setPointerInteractiveHover: (v: boolean) => void;
 * }} props
 */
export default function Experience({ setActiveModule, setPointerInteractiveHover }) {
  const monolithRef = useRef(null);
  const oracleGroupRef = useRef(null);
  const deskGroupRef = useRef(null);
  const careerRadarRef = useRef(null);
  const curriculumMonolithRef = useRef(null);
  const zenForgeRef = useRef(null);
  const chronosCoreRef = useRef(null);

  const bindInteractive = {
    onPointerOver: (e) => {
      e.stopPropagation();
      setPointerInteractiveHover(true);
      document.body.style.cursor = 'pointer';
    },
    onPointerOut: (e) => {
      e.stopPropagation();
      setPointerInteractiveHover(false);
      document.body.style.cursor = 'default';
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
    if (careerRadarRef.current) {
      careerRadarRef.current.rotation.y += delta * 0.25;
      careerRadarRef.current.rotation.z = Math.sin(t * 0.3) * 0.1;
    }
    if (curriculumMonolithRef.current) {
      curriculumMonolithRef.current.rotation.y += delta * 0.15;
    }
    if (zenForgeRef.current) {
      zenForgeRef.current.rotation.x += delta * 0.2;
      zenForgeRef.current.rotation.y += delta * 0.15;
      zenForgeRef.current.position.y = 1.8 + Math.sin(t * 0.8) * 0.1;
    }
    if (chronosCoreRef.current) {
      chronosCoreRef.current.rotation.y += delta * 0.5;
      chronosCoreRef.current.rotation.x = Math.sin(t * 0.8) * 0.1;
      chronosCoreRef.current.position.y = 2.5 + Math.sin(t * 0.6) * 0.15;
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

      {/* —— Career Radar —— */}
      <group
        position={[6.5, 2.2, -3.8]}
        onClick={(e) => {
          e.stopPropagation();
          setActiveModule('career');
        }}
        {...bindInteractive}
      >
        <mesh ref={careerRadarRef} castShadow>
          <sphereGeometry args={[0.85, 24, 24]} />
          <meshStandardMaterial
            color="#10b981"
            emissive="#064e3b"
            emissiveIntensity={0.4}
            wireframe
            transparent
            opacity={0.8}
          />
        </mesh>
        <pointLight position={[0, 0, 0]} intensity={0.6} distance={4} color="#10b981" />
        <Text
          position={[0, 1.3, 0]}
          fontSize={0.16}
          color="#d1fae5"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.06}
        >
          CAREER RADAR
        </Text>
      </group>

      {/* —— Curriculum Monolith —— */}
      <group
        position={[-7.2, 1.8, -2.5]}
        onClick={(e) => {
          e.stopPropagation();
          setActiveModule('curriculum');
        }}
        {...bindInteractive}
      >
        <mesh ref={curriculumMonolithRef} castShadow>
          <boxGeometry args={[0.8, 3.6, 0.8]} />
          <meshStandardMaterial
            color="#1e293b"
            metalness={0.9}
            roughness={0.1}
            emissive="#0f172a"
            emissiveIntensity={0.2}
          />
        </mesh>
        <pointLight position={[0, 1.8, 0]} intensity={0.4} distance={3} color="#6366f1" />
        <Text
          position={[0, 2.2, 0]}
          fontSize={0.15}
          color="#e0e7ff"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.06}
        >
          CURRICULUM
        </Text>
      </group>

      {/* —— Zen Clock —— */}
      <group
        position={[4.8, 1.8, 4.2]}
        onClick={(e) => {
          e.stopPropagation();
          setActiveModule('zen');
        }}
        {...bindInteractive}
      >
        <mesh ref={zenForgeRef} castShadow>
          <cylinderGeometry args={[0.8, 0.8, 0.2, 32]} />
          <meshStandardMaterial
            color="#8b5cf6"
            metalness={0.7}
            roughness={0.1}
            emissive="#6d28d9"
            emissiveIntensity={0.4}
          />
        </mesh>
        
        {/* Clock face */}
        <mesh position={[0, 0.11, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.75, 0.6, 0.05, 32]} />
          <meshStandardMaterial
            color="#f3f4f6"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        
        {/* Clock hands */}
        <mesh position={[0, 0.11, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <boxGeometry args={[0.05, 0.5, 0.02]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
        <mesh position={[0, 0.11, 0]} rotation={[Math.PI / 2, 0, Math.PI / 6]}>
          <boxGeometry args={[0.03, 0.35, 0.02]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
        
        {/* Center dot */}
        <mesh position={[0, 0.11, 0]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#f59e0b"
            emissiveIntensity={0.6}
          />
        </mesh>
        
        <pointLight position={[0, 0, 0]} intensity={0.7} distance={5} color="#8b5cf6" />
        <Text
          position={[0, 1.2, 0]}
          fontSize={0.16}
          color="#e9d5ff"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.06}
        >
          ZEN CLOCK
        </Text>
      </group>

      {/* —— Chronos Core —— */}
      <group
        position={[0, 2.5, 0]}
        onClick={(e) => {
          e.stopPropagation();
          setActiveModule('tracker');
        }}
        {...bindInteractive}
      >
        <mesh ref={chronosCoreRef} castShadow>
          <icosahedronGeometry args={[0.65, 0]} />
          <meshPhysicalMaterial
            color="#06b6d4"
            metalness={0.3}
            roughness={0.1}
            transmission={0.8}
            thickness={0.5}
            ior={1.5}
            emissive="#0891b2"
            emissiveIntensity={0.4}
            wireframe
          />
        </mesh>
        <mesh scale={1.15}>
          <icosahedronGeometry args={[0.65, 1]} />
          <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.3} />
        </mesh>
        <pointLight position={[0, 0, 0]} intensity={0.5} distance={4} color="#06b6d4" />
        <Text
          position={[0, 1.1, 0]}
          fontSize={0.16}
          color="#a5f3fc"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.06}
        >
          CHRONOS CORE
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
