"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { ensurePointerTracking, pointer, scroll } from "@/lib/runtime";
import { createGlowPointsMaterial, mulberry32, palette } from "./materials";

const BOX = { x: 22, y: 14, z: 9, zMin: -6 };
const LINK_DIST = 2.3;
const POINTER_RADIUS = 3.4;
const MAX_POINTER_LINKS = 10;

/** Click/tap bursts queued by the DOM listener, consumed in the frame loop. */
const bursts: { x: number; y: number }[] = [];

type Smooth = { x: number; y: number; scroll: number };

/** Map the (smoothed) pointer onto the z=0 plane, then into the rotating group's local space. */
function pointerToLocal(out: THREE.Vector3, s: Smooth, cam: THREE.PerspectiveCamera, group: THREE.Group, px = s.x, py = s.y) {
  const halfH = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)) * cam.position.z;
  out.set(px * halfH * cam.aspect, py * halfH, 0);
  return group.worldToLocal(out);
}

function Network({ count, animate, smooth }: { count: number; animate: boolean; smooth: React.RefObject<Smooth> }) {
  const { gl } = useThree();
  const group = useRef<THREE.Group>(null);
  const local = useMemo(() => new THREE.Vector3(), []);

  const data = useMemo(() => {
    const rand = mulberry32(7);
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const energy = new Float32Array(count);
    const kind = new Uint8Array(count); // 0 blue, 1 cyan, 2 orange
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (rand() - 0.5) * BOX.x;
      pos[i * 3 + 1] = (rand() - 0.5) * BOX.y;
      pos[i * 3 + 2] = BOX.zMin + rand() * BOX.z;
      vel[i * 3] = (rand() - 0.5) * 0.18;
      vel[i * 3 + 1] = (rand() - 0.5) * 0.18;
      vel[i * 3 + 2] = (rand() - 0.5) * 0.08;
      const r = rand();
      kind[i] = r < 0.07 ? 2 : r < 0.5 ? 0 : 1;
    }
    return { pos, vel, energy, kind };
  }, [count]);

  const maxLinks = count * 4 + MAX_POINTER_LINKS;
  const { pointGeo, lineGeo, pointMat } = useMemo(() => {
    const pointGeo = new THREE.BufferGeometry();
    pointGeo.setAttribute("position", new THREE.BufferAttribute(data.pos, 3).setUsage(THREE.DynamicDrawUsage));
    pointGeo.setAttribute("aColor", new THREE.BufferAttribute(new Float32Array(count * 3), 3).setUsage(THREE.DynamicDrawUsage));
    pointGeo.setAttribute("aSize", new THREE.BufferAttribute(new Float32Array(count), 1).setUsage(THREE.DynamicDrawUsage));
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(maxLinks * 6), 3).setUsage(THREE.DynamicDrawUsage));
    lineGeo.setAttribute("color", new THREE.BufferAttribute(new Float32Array(maxLinks * 6), 3).setUsage(THREE.DynamicDrawUsage));
    return { pointGeo, lineGeo, pointMat: createGlowPointsMaterial() };
  }, [data, count, maxLinks]);

  useEffect(() => {
    pointMat.uniforms.uPixelRatio.value = gl.getPixelRatio();
    pointMat.uniforms.uScale.value = 1.25;
    return () => {
      pointGeo.dispose();
      lineGeo.dispose();
      pointMat.dispose();
    };
  }, [gl, pointGeo, lineGeo, pointMat]);

  const fireTimer = useRef(0.6);
  const colors = [palette.blue, palette.cyan, palette.orange];

  useFrame((state, rawDt) => {
    const g = group.current;
    if (!g) return;
    const dt = animate ? Math.min(rawDt, 0.05) : 0;
    const t = state.clock.elapsedTime;
    const cam = state.camera as THREE.PerspectiveCamera;
    const s = smooth.current;

    // Scroll turns the whole volume and dollies the camera through it.
    g.rotation.y = s.scroll * Math.PI * 0.7 + s.x * 0.15 + (animate ? t * 0.02 : 0);
    g.rotation.x = -s.y * 0.1 + s.scroll * 0.25;
    cam.position.z = 9 - s.scroll * 2;
    g.updateMatrixWorld();

    pointerToLocal(local, s, cam, g);
    const live = animate && pointer.active && performance.now() - pointer.lastMove < 5000;
    const { pos, vel, energy, kind } = data;

    // Spontaneous firing + click bursts.
    if (animate) {
      fireTimer.current -= dt;
      if (fireTimer.current <= 0) {
        fireTimer.current = 1.6 + Math.random() * 2.4;
        energy[Math.floor(Math.random() * count)] = 1;
      }
    }
    while (bursts.length) {
      const b = bursts.pop()!;
      const bp = pointerToLocal(new THREE.Vector3(), s, cam, g, b.x, b.y);
      for (let i = 0; i < count; i++) {
        const dx = pos[i * 3] - bp.x, dy = pos[i * 3 + 1] - bp.y;
        if (dx * dx + dy * dy < 4) energy[i] = 1;
      }
    }

    const col = pointGeo.attributes.aColor.array as Float32Array;
    const size = pointGeo.attributes.aSize.array as Float32Array;
    const R2 = POINTER_RADIUS * POINTER_RADIUS;
    const hits: number[] = [];

    for (let i = 0; i < count; i++) {
      const k = i * 3;
      pos[k] += vel[k] * dt;
      pos[k + 1] += vel[k + 1] * dt;
      pos[k + 2] += vel[k + 2] * dt;
      if (pos[k] > BOX.x / 2 || pos[k] < -BOX.x / 2) vel[k] *= -1;
      if (pos[k + 1] > BOX.y / 2 || pos[k + 1] < -BOX.y / 2) vel[k + 1] *= -1;
      if (pos[k + 2] > BOX.zMin + BOX.z || pos[k + 2] < BOX.zMin) vel[k + 2] *= -1;
      energy[i] *= Math.exp(-dt * 1.9);

      let glow = 0;
      if (live) {
        const dx = local.x - pos[k];
        const dy = local.y - pos[k + 1];
        const d2 = dx * dx + dy * dy;
        if (d2 < R2) {
          glow = 1 - Math.sqrt(d2) / POINTER_RADIUS;
          // Neurons drift toward the cursor.
          pos[k] += dx * glow * 0.5 * dt;
          pos[k + 1] += dy * glow * 0.5 * dt;
          if (glow > 0.3) hits.push(i);
        }
      }
      const c = colors[kind[i]];
      const lum = (0.3 + 0.06 * Math.sin(t * 1.3 + i)) + glow * 0.6 + energy[i] * 0.7;
      col[k] = c.r * lum + energy[i] * 0.3;
      col[k + 1] = c.g * lum + energy[i] * 0.3;
      col[k + 2] = c.b * lum + energy[i] * 0.3;
      size[i] = 2.2 + glow * 1.6 + energy[i] * 2.5;
    }

    // Proximity links, with energy hopping across them.
    const lp = lineGeo.attributes.position.array as Float32Array;
    const lc = lineGeo.attributes.color.array as Float32Array;
    let n = 0;
    const L2 = LINK_DIST * LINK_DIST;
    const limit = maxLinks - MAX_POINTER_LINKS;
    for (let i = 0; i < count && n < limit; i++) {
      const a = i * 3;
      for (let j = i + 1; j < count && n < limit; j++) {
        const b = j * 3;
        const dx = pos[a] - pos[b], dy = pos[a + 1] - pos[b + 1], dz = pos[a + 2] - pos[b + 2];
        const d2 = dx * dx + dy * dy + dz * dz;
        if (d2 > L2) continue;
        if (animate && Math.random() < dt * 5) {
          if (energy[i] > 0.35 && energy[j] < energy[i] * 0.5) energy[j] = energy[i] * 0.62;
          else if (energy[j] > 0.35 && energy[i] < energy[j] * 0.5) energy[i] = energy[j] * 0.62;
        }
        const fade = (1 - Math.sqrt(d2) / LINK_DIST) * 0.22;
        const ea = fade * (1 + energy[i] * 2.5), eb = fade * (1 + energy[j] * 2.5);
        const ca = energy[i] > 0.25 ? palette.cyan : colors[kind[i]];
        const cb = energy[j] > 0.25 ? palette.cyan : colors[kind[j]];
        const o = n * 6;
        lp[o] = pos[a]; lp[o + 1] = pos[a + 1]; lp[o + 2] = pos[a + 2];
        lp[o + 3] = pos[b]; lp[o + 4] = pos[b + 1]; lp[o + 5] = pos[b + 2];
        lc[o] = ca.r * ea; lc[o + 1] = ca.g * ea; lc[o + 2] = ca.b * ea;
        lc[o + 3] = cb.r * eb; lc[o + 4] = cb.g * eb; lc[o + 5] = cb.b * eb;
        n++;
      }
    }

    // Bright links from the cursor to the neurons it touches.
    for (let h = 0; h < Math.min(hits.length, MAX_POINTER_LINKS); h++) {
      const b = hits[h] * 3;
      const o = n * 6;
      lp[o] = local.x; lp[o + 1] = local.y; lp[o + 2] = local.z;
      lp[o + 3] = pos[b]; lp[o + 4] = pos[b + 1]; lp[o + 5] = pos[b + 2];
      lc[o] = 0.04; lc[o + 1] = 0.2; lc[o + 2] = 0.26;
      lc[o + 3] = 0.02; lc[o + 4] = 0.14; lc[o + 5] = 0.22;
      n++;
    }

    lineGeo.setDrawRange(0, n * 2);
    lineGeo.attributes.position.needsUpdate = true;
    lineGeo.attributes.color.needsUpdate = true;
    pointGeo.attributes.position.needsUpdate = true;
    pointGeo.attributes.aColor.needsUpdate = true;
    pointGeo.attributes.aSize.needsUpdate = true;
  });

  return (
    <group ref={group}>
      <lineSegments geometry={lineGeo} frustumCulled={false}>
        <lineBasicMaterial vertexColors transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </lineSegments>
      <points geometry={pointGeo} material={pointMat} frustumCulled={false} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Floating wireframe crystals — scroll spins them, cursor drifts them  */
/* ------------------------------------------------------------------ */

const crystalSpecs = [
  { geo: () => new THREE.IcosahedronGeometry(1, 0), pos: [-10.5, 4.6, -4], scale: 1, color: palette.cyan, spin: 1 },
  { geo: () => new THREE.OctahedronGeometry(1, 0), pos: [10.5, -3.8, -3], scale: 0.85, color: palette.blue, spin: -1.2 },
  { geo: () => new THREE.DodecahedronGeometry(1, 0), pos: [-9.5, -6, -6], scale: 1.2, color: palette.blue, spin: 0.7 },
] as const;

function Crystals({ animate, smooth }: { animate: boolean; smooth: React.RefObject<Smooth> }) {
  const refs = useRef<(THREE.Group | null)[]>([]);
  const items = useMemo(
    () =>
      crystalSpecs.map((c) => {
        const solid = c.geo();
        const edges = new THREE.EdgesGeometry(solid);
        return { ...c, solid, edges };
      }),
    [],
  );
  useEffect(() => () => items.forEach((i) => (i.solid.dispose(), i.edges.dispose())), [items]);

  useFrame((state) => {
    const t = animate ? state.clock.elapsedTime : 0;
    const s = smooth.current;
    items.forEach((c, i) => {
      const g = refs.current[i];
      if (!g) return;
      const depth = 1 + c.pos[2] / 8; // nearer crystals move more
      g.position.set(
        c.pos[0] + s.x * 0.9 * depth,
        c.pos[1] + s.y * 0.6 * depth + s.scroll * 6 * depth - Math.sin(t * 0.4 + i) * 0.25,
        c.pos[2],
      );
      g.rotation.set(t * 0.15 * c.spin + s.scroll * Math.PI * 1.5 * c.spin, t * 0.2 * c.spin + s.scroll * Math.PI * c.spin, 0);
    });
  });

  return (
    <>
      {items.map((c, i) => (
        <group key={i} ref={(g) => { refs.current[i] = g; }} scale={c.scale}>
          <lineSegments geometry={c.edges}>
            <lineBasicMaterial color={c.color} transparent opacity={0.16} blending={THREE.AdditiveBlending} depthWrite={false} />
          </lineSegments>
          <mesh geometry={c.solid}>
            <meshBasicMaterial color={c.color} transparent opacity={0.012} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
        </group>
      ))}
    </>
  );
}

function Scene({ count, animate }: { count: number; animate: boolean }) {
  const smooth = useRef<Smooth>({ x: 0, y: 0, scroll: 0 });
  useFrame((_, rawDt) => {
    const s = smooth.current;
    const follow = animate ? Math.min(1, Math.min(rawDt, 0.05) * 3) : 1;
    s.x += ((animate ? pointer.x : 0) - s.x) * follow;
    s.y += ((animate ? pointer.y : 0) - s.y) * follow;
    s.scroll += (scroll.progress - s.scroll) * (animate ? Math.min(1, rawDt * 4) : 1);
  }, -1); // run before the scene objects read it
  return (
    <>
      <fog attach="fog" args={["#02050d", 8, 24]} />
      <Crystals animate={animate} smooth={smooth} />
      <Network count={count} animate={animate} smooth={smooth} />
    </>
  );
}

/** Fixed, full-viewport neural volume behind all content. Purely decorative. */
export default function NeuralField() {
  // Always animate — reduced motion only affects framer-motion transitions in content,
  // the WebGL background is a decorative layer, not accessibility-critical motion.
  const reduced = false;
  const count = typeof window !== "undefined" && window.innerWidth < 720 ? 36 : 75;

  useEffect(() => {
    ensurePointerTracking();
    const onDown = (e: PointerEvent) => {
      // Clicks on interactive UI shouldn't fire neurons.
      if ((e.target as HTMLElement).closest("a,button,input,textarea,[role=dialog]")) return;
      bursts.push({ x: (e.clientX / window.innerWidth) * 2 - 1, y: -(e.clientY / window.innerHeight) * 2 + 1 });
    };
    window.addEventListener("pointerdown", onDown, { passive: true });
    return () => window.removeEventListener("pointerdown", onDown);
  }, []);

  return (
    <div className="neural-field" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 9], fov: 55, near: 0.1, far: 60 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        frameloop={reduced ? "demand" : "always"}
      >
        <Scene count={count} animate={!reduced} />
      </Canvas>
    </div>
  );
}
