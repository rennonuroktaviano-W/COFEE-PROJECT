"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Procedural coffee cup, saucer and beans for the Smiljan hero (PRD 6.3).
 *
 * Everything is generated from primitives at runtime, so the project ships no
 * binary .glb model and works fully offline. Geometry stays deliberately low
 * (~4k triangles total) to keep mobile frame times comfortable.
 */

/** Samples a smooth profile through control points, ready for LatheGeometry. */
function sampleProfile(controlPoints, samples = 88) {
  const curve = new THREE.CatmullRomCurve3(
    controlPoints.map(([x, y]) => new THREE.Vector3(x, y, 0)),
    false,
    "centripetal",
  );
  return curve.getPoints(samples).map((point) => new THREE.Vector2(point.x, point.y));
}

// Outer wall, over the rim, back down the inside — a genuinely hollow cup.
const CUP_PROFILE = [
  [0.0, 0.0],
  [0.52, 0.0],
  [0.7, 0.05],
  [0.84, 0.28],
  [0.93, 0.75],
  [0.99, 1.55],
  [1.01, 2.25],
  [1.03, 2.52],
  [1.0, 2.62],
  [0.95, 2.6],
  [0.91, 2.4],
  [0.87, 1.6],
  [0.8, 0.85],
  [0.7, 0.46],
  [0.52, 0.3],
  [0.0, 0.27],
];

// Shallow dish the cup rests on.
const SAUCER_PROFILE = [
  [0.0, 0.0],
  [0.85, 0.0],
  [1.4, 0.02],
  [1.78, 0.12],
  [1.96, 0.24],
  [1.9, 0.29],
  [1.68, 0.2],
  [1.24, 0.09],
  [0.9, 0.05],
  [0.5, 0.04],
  [0.0, 0.04],
];

export function CoffeeCup({ lowDetail = false, castShadow = true }) {
  const groupRef = useRef(null);

  const cupGeometry = useMemo(
    () => new THREE.LatheGeometry(sampleProfile(CUP_PROFILE), lowDetail ? 40 : 72),
    [lowDetail],
  );

  const saucerGeometry = useMemo(
    () => new THREE.LatheGeometry(sampleProfile(SAUCER_PROFILE), lowDetail ? 32 : 64),
    [lowDetail],
  );

  const handleGeometry = useMemo(() => {
    const geometry = new THREE.TorusGeometry(0.46, 0.115, lowDetail ? 8 : 14, lowDetail ? 20 : 40, Math.PI * 1.25);
    geometry.rotateZ(-Math.PI * 0.62);
    return geometry;
  }, [lowDetail]);

  const coffeeGeometry = useMemo(() => {
    const geometry = new THREE.CircleGeometry(0.84, lowDetail ? 32 : 56);
    geometry.rotateX(-Math.PI / 2);
    return geometry;
  }, [lowDetail]);

  const cremaGeometry = useMemo(() => {
    const geometry = new THREE.RingGeometry(0.66, 0.84, lowDetail ? 32 : 56);
    geometry.rotateX(-Math.PI / 2);
    return geometry;
  }, [lowDetail]);

  // --- Materials (PRD 4.4: ceramic, brushed metal, dark wood) -------------
  const ceramicMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#f4ece0",
        roughness: 0.34,
        metalness: 0.0,
        clearcoat: 0.55,
        clearcoatRoughness: 0.28,
        side: THREE.DoubleSide,
      }),
    [],
  );

  const saucerMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#e8dcc6",
        roughness: 0.42,
        metalness: 0.0,
        clearcoat: 0.4,
        clearcoatRoughness: 0.35,
        side: THREE.DoubleSide,
      }),
    [],
  );

  const coffeeMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#2a150c",
        roughness: 0.24,
        metalness: 0.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.12,
      }),
    [],
  );

  const cremaMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#7a4a25",
        roughness: 0.62,
        metalness: 0.0,
        transparent: true,
        opacity: 0.75,
      }),
    [],
  );

  const beans = useMemo(() => {
    const positions = [
      { position: [1.42, 0.16, 0.72], rotation: [0.3, 0.7, 0.2], scale: 1.0 },
      { position: [1.66, 0.14, 0.3], rotation: [0.1, 2.1, 0.5], scale: 0.92 },
      { position: [1.5, 0.15, -0.34], rotation: [0.4, 4.0, 0.15], scale: 1.05 },
      { position: [-1.34, 0.16, 0.86], rotation: [0.2, 1.2, 0.35], scale: 0.95 },
      { position: [-1.58, 0.15, 0.2], rotation: [0.35, 3.2, 0.1], scale: 1.02 },
    ];
    return lowDetail ? positions.slice(0, 3) : positions;
  }, [lowDetail]);

  // Very slow idle drift so the object reads as alive without spinning.
  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    groupRef.current.rotation.y = Math.sin(time * 0.16) * 0.16 - 0.45;
    groupRef.current.position.y = Math.sin(time * 0.55) * 0.022;
  });

  return (
    <group ref={groupRef}>
      {/* Saucer */}
      <mesh geometry={saucerGeometry} material={saucerMaterial} position={[0, -0.02, 0]} castShadow={castShadow} receiveShadow />

      {/* Cup body */}
      <mesh geometry={cupGeometry} material={ceramicMaterial} castShadow={castShadow} receiveShadow />

      {/* Handle */}
      <mesh
        geometry={handleGeometry}
        material={ceramicMaterial}
        position={[0.98, 1.42, 0]}
        rotation={[0, Math.PI / 2, 0]}
        castShadow={castShadow}
      />

      {/* Coffee surface + crema ring */}
      <mesh geometry={coffeeGeometry} material={coffeeMaterial} position={[0, 2.05, 0]} />
      <mesh geometry={cremaGeometry} material={cremaMaterial} position={[0, 2.055, 0]} />

      {/* Scattered beans */}
      {beans.map((bean, index) => (
        <group
          key={bean.id ?? index}
          position={bean.position}
          rotation={bean.rotation}
          scale={bean.scale}
        >
          <BeanGeometry lowDetail={lowDetail} castShadow={castShadow} />
        </group>
      ))}

      {/* Steam */}
      {!lowDetail ? <Steam /> : null}
    </group>
  );
}

function BeanGeometry({ lowDetail, castShadow }) {
  const body = useMemo(() => {
    const geometry = new THREE.IcosahedronGeometry(0.17, lowDetail ? 1 : 2);
    geometry.scale(1, 0.66, 0.78);
    return geometry;
  }, [lowDetail]);

  const crease = useMemo(() => {
    const geometry = new THREE.TorusGeometry(0.115, 0.022, 6, lowDetail ? 12 : 22, Math.PI);
    geometry.rotateX(Math.PI / 2);
    geometry.rotateZ(Math.PI / 2);
    return geometry;
  }, [lowDetail]);

  const bodyMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#3b2114", roughness: 0.52, metalness: 0.02 }),
    [],
  );

  const creaseMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#1c0f08", roughness: 0.78, metalness: 0.0 }),
    [],
  );

  return (
    <group>
      <mesh geometry={body} material={bodyMaterial} castShadow={castShadow} />
      <mesh geometry={crease} material={creaseMaterial} position={[0, 0.085, 0]} />
    </group>
  );
}

/**
 * Three soft billboards rising from the cup. Extremely low opacity and slow,
 * so the motion reads as atmosphere rather than an effect (PRD 6.1).
 */
function Steam() {
  const texture = useMemo(() => {
    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext("2d");
    const gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, "rgba(255,255,255,0.85)");
    gradient.addColorStop(0.45, "rgba(255,255,255,0.28)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);
    const generated = new THREE.CanvasTexture(canvas);
    generated.needsUpdate = true;
    return generated;
  }, []);

  const wisps = useRef([]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    wisps.current.forEach((wisp, index) => {
      if (!wisp) return;
      const phase = (time * 0.28 + index * 0.33) % 1;
      wisp.position.y = 2.7 + phase * 1.5;
      wisp.material.opacity = Math.sin(phase * Math.PI) * 0.16;
      const scale = 0.42 + phase * 0.7;
      wisp.scale.set(scale, scale, scale);
      wisp.position.x = Math.sin(time * 0.5 + index * 1.7) * 0.12;
    });
  });

  return (
    <group>
      {[0, 1, 2].map((index) => (
        <sprite
          key={index}
          ref={(node) => {
            wisps.current[index] = node;
          }}
          position={[0, 2.8, 0]}
        >
          <spriteMaterial
            map={texture}
            transparent
            depthWrite={false}
            opacity={0}
            color="#fff6e8"
          />
        </sprite>
      ))}
    </group>
  );
}

export default CoffeeCup;
