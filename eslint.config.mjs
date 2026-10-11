import next from "eslint-config-next";

const config = [
  ...next,
  {
    // WebGL scenes mutate GPU buffers and uniforms inside useFrame by design
    // (React Three Fiber's hot path) — React Compiler purity rules don't apply there.
    files: ["components/three/**/*.{ts,tsx}"],
    rules: {
      "react-hooks/immutability": "off",
      "react-hooks/use-memo": "off",
    },
  },
  { ignores: [".next/**", "node_modules/**"] },
];

export default config;
