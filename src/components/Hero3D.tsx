// Browser-only 3D scene (loaded lazily, never on the server).
// A breathing particle sphere + wireframe knot that react to the mouse.
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const COUNT = 2600;

function ParticleSphere({ primary, accent }: { primary: string; accent: string }) {
  const ref = useRef<THREE.Points>(null);
  const { positions, base, colors } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const base = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const c1 = new THREE.Color(primary);
    const c2 = new THREE.Color(accent);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < COUNT; i++) {
      const y = 1 - (i / (COUNT - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const t = golden * i;
      const x = Math.cos(t) * r;
      const z = Math.sin(t) * r;
      base.set([x * 1.7, y * 1.7, z * 1.7], i * 3);
      positions.set([x * 1.7, y * 1.7, z * 1.7], i * 3);
      const c = c1.clone().lerp(c2, (y + 1) / 2);
      colors.set([c.r, c.g, c.b], i * 3);
    }
    return { positions, base, colors };
  }, [primary, accent]);

  useFrame((state, delta) => {
    const p = ref.current;
    if (!p) return;
    const t = state.clock.elapsedTime;
    const attr = p.geometry.getAttribute("position") as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < COUNT; i++) {
      const bx = base[i * 3]!,
        by = base[i * 3 + 1]!,
        bz = base[i * 3 + 2]!;
      const wave = 1 + 0.12 * Math.sin(by * 3 + t * 1.6) * Math.cos(bx * 3 + t);
      arr[i * 3] = bx * wave;
      arr[i * 3 + 1] = by * wave;
      arr[i * 3 + 2] = bz * wave;
    }
    attr.needsUpdate = true;
    const dt = Math.min(delta, 0.05);
    p.rotation.y += dt * 0.15;
    p.rotation.x = THREE.MathUtils.damp(p.rotation.x, state.pointer.y * 0.5, 2.5, dt);
    p.rotation.z = THREE.MathUtils.damp(p.rotation.z, -state.pointer.x * 0.3, 2.5, dt);
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={0.95}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Knot({ color }: { color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, d) => {
    if (!ref.current) return;
    ref.current.rotation.x += Math.min(d, 0.05) * 0.3;
    ref.current.rotation.y += Math.min(d, 0.05) * 0.2;
  });
  return (
    <Float speed={2} floatIntensity={0.8}>
      <mesh ref={ref} scale={0.55}>
        <torusKnotGeometry args={[1, 0.32, 160, 20]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.55} />
      </mesh>
    </Float>
  );
}

function OrbitRing({
  color,
  radius,
  speed,
  tilt,
}: {
  color: string;
  radius: number;
  speed: number;
  tilt: number;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.y += Math.min(d, 0.05) * speed;
  });
  return (
    <group rotation={[tilt, 0, 0.2]}>
      <group ref={ref}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[radius, 0.008, 8, 200]} />
          <meshBasicMaterial color={color} transparent opacity={0.6} />
        </mesh>
        <mesh position={[radius, 0, 0]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshBasicMaterial color={color} />
        </mesh>
      </group>
    </group>
  );
}

export default function Hero3D({ primary, accent }: { primary: string; accent: string }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 5.4], fov: 45 }}
      gl={{ alpha: true, antialias: true }}
    >
      <ParticleSphere primary={primary} accent={accent} />
      <Knot color={accent} />
      <OrbitRing color={primary} radius={2.35} speed={0.6} tilt={0.35} />
      <OrbitRing color={accent} radius={2.65} speed={-0.4} tilt={-0.5} />
    </Canvas>
  );
}
