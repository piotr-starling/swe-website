import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { Sphere, MeshDistortMaterial } from '@react-three/drei'
import { Vector2, Mesh } from 'three'

function AnimatedSphere({ mouse }: { mouse: Vector2 }) {
  const meshRef = useRef<Mesh>(null!)
  const [hovered, setHovered] = useState(false)
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Smooth follow mouse with increased movement
      meshRef.current.rotation.x += (mouse.y * 0.5 - meshRef.current.rotation.x) * 0.1
      meshRef.current.rotation.y += (mouse.x * 0.5 - meshRef.current.rotation.y) * 0.1
      
      // Floating animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2
      
      // Scale effect on hover
      const targetScale = hovered ? 1.2 : 1
      meshRef.current.scale.x += (targetScale - meshRef.current.scale.x) * 0.1
      meshRef.current.scale.y += (targetScale - meshRef.current.scale.y) * 0.1
      meshRef.current.scale.z += (targetScale - meshRef.current.scale.z) * 0.1
    }
  })

  return (
    <Sphere 
      ref={meshRef} 
      args={[2, 128, 128]} // Increased size and segments
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <MeshDistortMaterial
        color="#49FFD7"
        attach="material"
        distort={hovered ? 0.6 : 0.4}
        speed={4}
        roughness={0}
        metalness={0.9}
      />
    </Sphere>
  )
}

export function HeroAnimation() {
  const mousePosition = useRef(new Vector2(0, 0))
  
  const handleMouseMove = (event: React.MouseEvent) => {
    const x = (event.clientX / window.innerWidth) * 2 - 1
    const y = -(event.clientY / window.innerHeight) * 2 + 1
    mousePosition.current.set(x, y)
  }

  return (
    <div 
      onMouseMove={handleMouseMove}
      style={{
        position: 'absolute',
        top: '-20%', // Move up to overlap with headline
        right: '-10%', // Extend beyond the right edge
        width: '70%', // Increased width
        height: '140%', // Increased height
        zIndex: 0,
        pointerEvents: 'all'
      }}
    >
      <Canvas 
        camera={{ position: [0, 0, 6] }} // Adjusted camera position
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <AnimatedSphere mouse={mousePosition.current} />
      </Canvas>
    </div>
  )
} 