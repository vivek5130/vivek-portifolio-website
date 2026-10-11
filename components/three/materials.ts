import * as THREE from "three";

/** Shared palette in linear-ish RGB for shaders. */
export const palette = {
  cyan: new THREE.Color("#3ee7ff"),
  blue: new THREE.Color("#2f7bff"),
  deep: new THREE.Color("#1a3a8f"),
  orange: new THREE.Color("#ff8a3d"),
  white: new THREE.Color("#e8f6ff"),
};

/** Soft round glowing sprite points with per-vertex size + colour (additive). */
export function createGlowPointsMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: { uPixelRatio: { value: 1 }, uScale: { value: 1 } },
    vertexShader: /* glsl */ `
      attribute float aSize;
      attribute vec3 aColor;
      varying vec3 vColor;
      uniform float uPixelRatio;
      uniform float uScale;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = aSize * uPixelRatio * uScale * (10.0 / -mv.z);
        vColor = aColor;
      }
    `,
    fragmentShader: /* glsl */ `
      varying vec3 vColor;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float core = smoothstep(0.5, 0.0, d);
        float a = pow(core, 2.4) + smoothstep(0.12, 0.0, d) * 0.6;
        gl_FragColor = vec4(vColor * a, a);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}

/** Deterministic PRNG so layouts are stable between renders. */
export function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
