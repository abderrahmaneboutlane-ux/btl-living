"use client";

/**
 * WebGL hero layer — a full-viewport quad carrying the showroom render,
 * driven by a fragment shader:
 *   · slow "breathing" zoom          (uTime)
 *   · mouse parallax on the plate    (uMouse)
 *   · scroll-linked push-in + lift   (uScroll)
 *   · warm grade + soft vignette
 *
 * Aspect is handled with a cover-fit mapping so the render never distorts.
 * This is an ENHANCEMENT: <Hero> already paints the same image in CSS, and this
 * canvas only fades in once the texture is decoded.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  uniform sampler2D uTex;
  uniform vec2  uCover;   // cover-fit scale
  uniform vec2  uMouse;
  uniform float uTime;
  uniform float uScroll;
  varying vec2 vUv;

  void main() {
    vec2 c = vUv - 0.5;

    // cover fit (no distortion)
    c *= uCover;

    // breathing + scroll push-in
    float zoom = 1.0 + 0.035 * sin(uTime * 0.12) - uScroll * 0.10;
    c /= zoom;

    // parallax: foreground drifts against the mouse
    c += uMouse * 0.014;

    // slight scroll lift
    c.y -= uScroll * 0.03;

    vec2 uv = c + 0.5;
    vec3 col = texture2D(uTex, uv).rgb;

    // NO grading, NO vignette — the render is shown exactly as shot.
    gl_FragColor = vec4(col, 1.0);
  }
`;

function Plate({ onReady }: { onReady: () => void }) {
  // lighter master for the GL layer (~0.5 MB vs ~0.9 MB); WebP is universal now
  const texture = useTexture("/showroom.webp");
  const mat = useRef<THREE.ShaderMaterial>(null!);
  const { viewport, size } = useThree();
  const mouse = useRef(new THREE.Vector2(0, 0));
  const target = useRef(new THREE.Vector2(0, 0));

  const { gl } = useThree();
  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    // 4K master downscaled to the viewport — trilinear + anisotropy keeps it
    // crisp and shimmer-free.
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
    texture.needsUpdate = true;
    onReady();
  }, [texture, gl, onReady]);

  const uniforms = useMemo(
    () => ({
      uTex: { value: texture },
      uCover: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uTime: { value: 0 },
      uScroll: { value: 0 },
    }),
    [texture],
  );

  // cover-fit: compare image aspect to viewport aspect
  useEffect(() => {
    const img = texture.image as { width: number; height: number } | undefined;
    if (!img?.width) return;
    const imgA = img.width / img.height;
    const viewA = size.width / size.height;
    const cover =
      viewA > imgA
        ? new THREE.Vector2(1, imgA / viewA)
        : new THREE.Vector2(viewA / imgA, 1);
    uniforms.uCover.value.copy(cover);
  }, [texture, size, uniforms]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      target.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1),
      );
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, dt) => {
    if (!mat.current) return;
    mouse.current.lerp(target.current, Math.min(1, dt * 2.2));
    uniforms.uMouse.value.copy(mouse.current);
    uniforms.uTime.value = state.clock.elapsedTime;

    const scrolled = window.scrollY / Math.max(1, window.innerHeight);
    uniforms.uScroll.value = THREE.MathUtils.damp(
      uniforms.uScroll.value,
      Math.min(1, scrolled),
      4,
      dt,
    );
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={mat}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default function HeroCanvas() {
  const [ready, setReady] = useState(false);

  return (
    <div
      className="absolute inset-0 transition-opacity duration-1000 ease-luxe"
      style={{ opacity: ready ? 1 : 0 }}
      aria-hidden="true"
    >
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 1], fov: 50 }}
      >
        <Plate onReady={() => setReady(true)} />
      </Canvas>
    </div>
  );
}