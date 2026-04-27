import * as THREE from "three"
import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import { useScroll, Float } from "@react-three/drei"
import { EffectComposer, Bloom, DepthOfField } from "@react-three/postprocessing"
import { features } from "./data"

/* CAMERA RIG */
function CameraRig() {
  const scroll = useScroll()

  useFrame(({ camera }) => {
    const offset = scroll.offset

    camera.position.z = 6 - offset * 10
    camera.position.y = offset * 2
    camera.rotation.x = -offset * 0.3
  })

  return null
}

/* SPACE */
function Space() {
  const ref = useRef()

  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y = clock.elapsedTime * 0.05
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[50, 32, 32]} />
      <meshBasicMaterial color="#020617" side={THREE.BackSide} />
    </mesh>
  )
}

/* FEATURE */
function Feature({ position }) {
  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={1.2}>
      <mesh position={position}>
        <boxGeometry args={[2, 1.2, 0.2]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.9}
          roughness={0.15}
          thickness={0.5}
        />
      </mesh>
    </Float>
  )
}

/* SCENE */
export default function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />
      <pointLight position={[-5, 0, 5]} color="#38bdf8" intensity={2} />

      <Space />
      <CameraRig />

      <Feature position={[-2.5, 1.5, -2]} />
      <Feature position={[2.5, 1, -5]} />
      <Feature position={[0, -1.5, -8]} />
      <Feature position={[2, -2, -12]} />

      <EffectComposer>
        <Bloom intensity={1.2} luminanceThreshold={0.2} />
        <DepthOfField
          focusDistance={0.02}
          focalLength={0.03}
          bokehScale={3}
        />
      </EffectComposer>
    </>
  )
}