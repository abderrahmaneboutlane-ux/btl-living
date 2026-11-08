"use client";

/**
 * "Nos finitions" — three material spheres rendered in a small studio HDRI
 * built from <Lightformer>s (no network fetch). Hover lifts and spins one up.
 * A real, useful 3D moment for a furniture house: the finish library.
 */

import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";

export interface Finish {
  id: string;
  name: string;
  note: string;
  color: string;
  roughness: number;
  metalness: number;
  clearcoat?: boolean;
}

export const FINISHES: Finish[] = [
  {
    id: "chene",
    name: "Chêne clair",
    note: "Placage huilé, veinage apparent",
    color: "#C9A87C",
    roughness: 0.68,
    metalness: 0,
  },
  {
    id: "cognac",
    name: "Cuir cognac",
    note: "Pleine fleur, patine naturelle",
    color: "#8E5A34",
    roughness: 0.52,
    metalness: 0,
  },
  {
    id: "bronze",
    name: "Bronze brossé",
    note: "Piètements et poignées",
    color: "#8A6A45",
    roughness: 0.28,
    metalness: 0.95,
  },
  {
    id: "marbre",
    name: "Marbre ivoire",
    note: "Plateaux et consoles",
    color: "#EDE6DB",
    roughness: 0.14,
    metalness: 0.04,
  },
];

function Orb({
  finish,
  index,
  total,
  active,
  onHover,
}: {
  finish: Finish;
  index: number;
  total: number;
  active: boolean;
  onHover: (id: string | null) => void;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  const spread = 2.05;
  const x = (index - (total - 1) / 2) * spread;

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    ref.current.position.y =
      Math.sin(t * 0.7 + index * 1.3) * 0.07 + (active ? 0.22 : 0);
    ref.current.rotation.y += dt * (active ? 0.55 : 0.16);
    const s = THREE.MathUtils.damp(ref.current.scale.x, active ? 1.12 : 1, 6, dt);
    ref.current.scale.setScalar(s);
  });

  return (
    <mesh
      ref={ref}
      position={[x, 0, 0]}
      castShadow
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(finish.id);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        onHover(null);
        document.body.style.cursor = "auto";
      }}
    >
      <sphereGeometry args={[0.78, 64, 64]} />
      <meshStandardMaterial
        color={finish.color}
        roughness={finish.roughness}
        metalness={finish.metalness}
        envMapIntensity={1.35}
      />
    </mesh>
  );
}

export default function Finishes3D({
  onActive,
}: {
  onActive?: (id: string | null) => void;
}) {
  const [hover, setHover] = useState<string | null>(null);

  const handle = (id: string | null) => {
    setHover(id);
    onActive?.(id);
  };

  return (
    <div className="h-[46vh] min-h-[300px] w-full">
      <Canvas
        shadows
        dpr={[1, 1.75]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0.3, 6.2], fov: 38 }}
        onPointerMissed={() => handle(null)}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[4, 6, 4]} intensity={1.4} castShadow />

        <Suspense fallback={null}>
          <Environment resolution={256}>
            <Lightformer
              intensity={3.2}
              rotation-x={Math.PI / 2}
              position={[0, 5, -6]}
              scale={[10, 10, 1]}
            />
            <Lightformer
              intensity={1.4}
              rotation-y={Math.PI / 2}
              position={[-6, 1, 0]}
              scale={[10, 3, 1]}
              color="#fff3e2"
            />
            <Lightformer
              intensity={1.2}
              rotation-y={-Math.PI / 2}
              position={[6, 1, 0]}
              scale={[10, 3, 1]}
              color="#f2f5ff"
            />
          </Environment>

          {FINISHES.map((f, i) => (
            <Orb
              key={f.id}
              finish={f}
              index={i}
              total={FINISHES.length}
              active={hover === f.id}
              onHover={handle}
            />
          ))}

          <ContactShadows
            position={[0, -1.05, 0]}
            scale={14}
            blur={2.4}
            opacity={0.34}
            far={4}
            color="#5a4433"
          />
        </Suspense>
      </Canvas>
    </div>
  );
}