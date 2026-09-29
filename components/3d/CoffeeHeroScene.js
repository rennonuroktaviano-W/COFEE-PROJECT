"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { AdaptiveDpr, Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { CoffeeCup } from "./CoffeeCup";
import { useDeviceCapability, useMediaQuery } from "@/lib/mediaQuery";

/**
 * Decides how much detail the scene can afford. Small screens, data-saver mode
 * and low-core devices all get reduced geometry, no shadows and lower DPR
 * (PRD 6.3 "if 3D assets hurt mobile performance, ship a lighter scene").
 */
function useLowDetail() {
  const isSmallScreen = useMediaQuery("(max-width: 767px)");
  const capability = useDeviceCapability();
  return isSmallScreen || capability === "low";
}

/**
 * Slow depth parallax on pointer movement (PRD 6.2 "Depth parallax" / hero
 * object reacting to the pointer). Purely decorative: movement is capped at a
 * few degrees so the scene never hijacks attention, and nothing is gated
 * behind it.
 */
function PointerParallax({ children }) {
  const groupRef = useRef(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const targetX = state.pointer.y * 0.16;
    const targetY = state.pointer.x * 0.26;
    const damping = 1 - Math.pow(0.001, delta);

    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetX,
      damping,
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetY,
      damping,
    );
  });

  return <group ref={groupRef}>{children}</group>;
}

/** Dark wood table plane that grounds the object and catches the key shadow. */
function Table({ castShadow }) {
  const material = useRef(null);

  useFrame((state) => {
    if (!material.current) return;
    // Very slow specular drift, like light moving across polished wood.
    material.current.roughness = 0.62 + Math.sin(state.clock.getElapsedTime() * 0.3) * 0.04;
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.035, 0]} receiveShadow>
      <circleGeometry args={[7, 64]} />
      <meshStandardMaterial ref={material} color="#3a2519" roughness={0.62} metalness={0.05} />
    </mesh>
  );
}

/** True once the first frame has been rendered, used to fade in over the poster. */
function ReadySignal({ onReady }) {
  const fired = useRef(false);

  useFrame(() => {
    if (fired.current) return;
    fired.current = true;
    onReady?.();
  });

  return null;
}

/**
 * Live hero scene. Mounted only in the browser by HeroScene.js and only when
 * WebGL is available and reduced motion is not requested.
 */
export function CoffeeHeroScene({ onReady }) {
  const lowDetail = useLowDetail();
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef(null);

  // Stop rendering entirely once the hero scrolls away (PRD 10 performance).
  useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.01 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="size-full">
      <Canvas
        // Pausing the loop off-screen is the single biggest mobile win here.
        frameloop={isVisible ? "always" : "never"}
        dpr={[1, lowDetail ? 1.35 : 1.75]}
        // `true` resolves to THREE.PCFSoftShadowMap, which three r186 removed
        // (it logs a deprecation warning and silently downgrades). "percentage"
        // maps to PCFShadowMap, which is the supported equivalent.
        shadows={lowDetail ? false : "percentage"}
        camera={{ position: [3.5, 2.7, 4.5], fov: 30, near: 0.1, far: 60 }}
        gl={{
          antialias: !lowDetail,
          powerPreference: "high-performance",
          alpha: true,
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.08;
        }}
        performance={{ min: 0.5 }}
      >
        <color attach="background" args={["#f2e9d8"]} />

        <ambientLight intensity={0.5} color="#f6e6cf" />
        {/* Warm key light from the upper left. */}
        <directionalLight
          position={[-4, 6, 3.5]}
          intensity={2.4}
          color="#ffd9a8"
          castShadow={!lowDetail}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.0006}
        />
        {/* Cooler rim light to separate the cup from the background. */}
        <directionalLight position={[4.5, 2.5, -4]} intensity={0.85} color="#c9d4e0" />
        <pointLight position={[0, 1.4, 3.2]} intensity={12} distance={9} color="#ffe2bd" />

        {/* Lightformers are rendered into a local cubemap — no external HDR
            file is fetched, keeping the scene fully offline (PRD 6.3). */}
        <Environment resolution={lowDetail ? 64 : 128} frames={1} background={false}>
          <Lightformer
            form="rect"
            intensity={2.6}
            color="#fff1d6"
            position={[-2, 3, 2]}
            scale={[5, 3, 1]}
          />
          <Lightformer
            form="rect"
            intensity={1.1}
            color="#d8e2ef"
            position={[3.5, 1.5, -2]}
            rotation={[0, -Math.PI / 3, 0]}
            scale={[4, 3, 1]}
          />
          <Lightformer
            form="circle"
            intensity={1.8}
            color="#ffe6c0"
            position={[0, 5, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            scale={[3, 3, 1]}
          />
          <Lightformer
            form="rect"
            intensity={0.5}
            color="#5a3828"
            position={[0, -2, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={[8, 8, 1]}
          />
        </Environment>

        <PointerParallax>
          <CoffeeCup lowDetail={lowDetail} castShadow={!lowDetail} />
        </PointerParallax>

        <Table castShadow={!lowDetail} />

        {/* drei drops DPR under load, protecting frame rate on weak devices. */}
        <AdaptiveDpr pixelated={false} />

        <ReadySignal onReady={onReady} />
      </Canvas>
    </div>
  );
}

export default CoffeeHeroScene;
