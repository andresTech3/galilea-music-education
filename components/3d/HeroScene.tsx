'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Sphere, Torus, Stars } from '@react-three/drei'
import * as THREE from 'three'

// Floating music notes as 3D geometry
function MusicNote({ position, scale, speed }: { 
  position: [number, number, number]
  scale: number
  speed: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed + position[0]) * 0.3
    meshRef.current.rotation.y += 0.01
    meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
  })

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <torusGeometry args={[0.3, 0.08, 8, 20]} />
      <meshStandardMaterial
        color="#ff00aa"
        emissive="#ff00aa"
        emissiveIntensity={0.4}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  )
}

// Central orb - represents sound/music
function CentralOrb() {
  const orbRef = useRef<THREE.Mesh>(null)
  const { mouse } = useThree()

  useFrame((state) => {
    if (!orbRef.current) return
    orbRef.current.rotation.x = state.clock.elapsedTime * 0.15
    orbRef.current.rotation.y = state.clock.elapsedTime * 0.2
    // Subtle mouse parallax
    orbRef.current.position.x = THREE.MathUtils.lerp(
      orbRef.current.position.x,
      mouse.x * 0.5,
      0.05
    )
    orbRef.current.position.y = THREE.MathUtils.lerp(
      orbRef.current.position.y,
      mouse.y * 0.3,
      0.05
    )
  })

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <Sphere ref={orbRef} args={[1.2, 64, 64]}>
        <MeshDistortMaterial
          color="#1a0011"
          emissive="#ff00aa"
          emissiveIntensity={0.15}
          distort={0.4}
          speed={2}
          metalness={0.9}
          roughness={0.1}
        />
      </Sphere>
    </Float>
  )
}

// Rotating ring
function Ring({ radius, tubeRadius, rotation, speed }: {
  radius: number
  tubeRadius: number
  rotation: [number, number, number]
  speed: number
}) {
  const ringRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!ringRef.current) return
    ringRef.current.rotation.x = rotation[0] + state.clock.elapsedTime * speed
    ringRef.current.rotation.z = rotation[2] + state.clock.elapsedTime * speed * 0.5
  })

  return (
    <Torus ref={ringRef} args={[radius, tubeRadius, 8, 60]} rotation={rotation}>
      <meshStandardMaterial
        color="#ff00aa"
        emissive="#ff00aa"
        emissiveIntensity={0.5}
        transparent
        opacity={0.6}
        metalness={1}
        roughness={0}
        wireframe
      />
    </Torus>
  )
}

// Particle field
function Particles() {
  const count = 120
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6
    }
    return pos
  }, [])

  const particlesRef = useRef<THREE.Points>(null)

  useFrame((state) => {
    if (!particlesRef.current) return
    particlesRef.current.rotation.y = state.clock.elapsedTime * 0.03
    particlesRef.current.rotation.x = state.clock.elapsedTime * 0.01
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#ff00aa"
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  )
}

// Scene composition
function Scene() {
  const notePositions: Array<[number, number, number]> = [
    [-3, 1, -1], [3, -0.5, -2], [-2, -2, -1],
    [2.5, 1.5, -1.5], [-3.5, -1, -2], [4, 0.5, -1],
    [1, 2.5, -2], [-1.5, 2, -1.5]
  ]

  return (
    <>
      <Stars radius={80} depth={60} count={3000} factor={3} fade speed={0.5} />
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 3]} intensity={2} color="#ff00aa" />
      <pointLight position={[-4, 3, 2]} intensity={0.8} color="#ffffff" />
      <pointLight position={[4, -3, 2]} intensity={0.6} color="#ff66cc" />

      <CentralOrb />
      
      <Ring radius={2.2} tubeRadius={0.02} rotation={[Math.PI / 2, 0, 0]} speed={0.3} />
      <Ring radius={2.8} tubeRadius={0.015} rotation={[Math.PI / 4, 0, Math.PI / 6]} speed={0.2} />
      <Ring radius={3.5} tubeRadius={0.01} rotation={[0, Math.PI / 3, Math.PI / 4]} speed={0.15} />

      {notePositions.map((pos, i) => (
        <MusicNote
          key={i}
          position={pos}
          scale={0.2 + Math.random() * 0.2}
          speed={0.5 + i * 0.1}
        />
      ))}

      <Particles />
    </>
  )
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 55 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
    >
      <Scene />
    </Canvas>
  )
}
