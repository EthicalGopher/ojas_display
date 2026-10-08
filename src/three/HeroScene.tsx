import { Suspense, useMemo, useRef, type ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, Float, Grid, Lightformer, Sparkles } from '@react-three/drei';
import { Bloom, EffectComposer, Noise, Vignette } from '@react-three/postprocessing';
import { AdditiveBlending, Color, DoubleSide, Vector3, type Group, type Mesh } from 'three';
import { PoseFigure } from './PoseFigure';
import { Dumbbell, Kettlebell, WeightPlate } from './Gear';
import { palette } from './palette';
import { CYCLE, SEGMENT, createLandmarks, type PoseMode, type PoseStats } from './pose';
import { Athlete } from './Athlete';
import { prefersReducedMotion } from './useInView';
import { scrollState } from '../lib/scroll';

type Props = {
  active: boolean;
  mode?: PoseMode;
  onStats?: (stats: PoseStats) => void;
  flagKnees?: boolean;
  /** Horizontal scan band sweeping the body (posture scanner). */
  scanBeam?: boolean;
  /** Turntable rotation speed in rad/s (non-cycle modes). */
  spin?: number;
};

type Shot = { pos: [number, number, number]; look: [number, number, number] };

/** One camera setup per exercise, picked to show that movement best. */
const SHOTS: Record<string, Shot> = {
  squat: { pos: [2.7, 0.95, 2.5], look: [0, 0.72, 0] }, // side three-quarter: depth reads clearly
  skip: { pos: [0.25, 0.42, 3.5], look: [0, 0.95, 0] }, // low front: the rope sweeps past the lens
  curl: { pos: [-1.7, 1.38, 2.45], look: [0.05, 1.1, 0] }, // close on the arms and dumbbells
  swing: { pos: [2.9, 0.75, 1.4], look: [0, 0.8, 0] }, // side-on: the hip hinge and bell arc
  balance: { pos: [-1.2, 1.0, 3.2], look: [0, 0.95, 0] }, // three-quarter front: the standing leg and raised knee
  scan: { pos: [0, 1.15, 3.9], look: [0, 0.9, 0] },
};

/** Glides between shots like a dolly, with a slow orbit and a little pointer parallax. */
const Director = ({ cycle }: { cycle: boolean }) => {
  const look = useMemo(() => new Vector3(0, 0.9, 0), []);
  const target = useMemo(() => new Vector3(), []);
  const lookTarget = useMemo(() => new Vector3(), []);
  useFrame(({ pointer, camera, size, clock }, delta) => {
    const t = clock.getElapsedTime();
    const ex = cycle ? CYCLE[Math.floor(t / SEGMENT) % CYCLE.length] : 'scan';
    const shot = SHOTS[ex];
    const local = cycle ? (t % SEGMENT) / SEGMENT : 0;
    // tall/narrow stages pull back so the whole body stays in frame
    const pull = size.width / size.height < 1 ? 1.22 : 1;
    // slow push-in across each shot
    const push = 1.06 - local * 0.1;
    target.set(...shot.pos).multiplyScalar(pull * push);
    target.x += pointer.x * 0.35;
    target.y += pointer.y * 0.18;
    // gentle orbit drift, plus a half-orbit as the visitor scrolls through the hero
    const drift = Math.sin(t * 0.25) * 0.25 + (cycle ? scrollState.hero * 1.6 : 0);
    target.applyAxisAngle(new Vector3(0, 1, 0), drift);
    lookTarget.set(...shot.look);
    const k = Math.min(1, delta * 1.6);
    camera.position.lerp(target, k);
    look.lerp(lookTarget, k);
    camera.lookAt(look);
  });
  return null;
};

const Turntable = ({ spin, children }: { spin: number; children: ReactNode }) => {
  const group = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (group.current && spin) {
      group.current.rotation.y = -0.35 + Math.sin(clock.getElapsedTime() * spin) * 0.6;
    }
  });
  return <group ref={group}>{children}</group>;
};

const ScanRing = () => {
  const ring = useRef<Mesh>(null);
  const color = useMemo(() => new Color(palette.brassHi).multiplyScalar(1.4), []);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!ring.current) return;
    ring.current.position.y = 0.95 + Math.sin(t * 0.9) * 0.85;
    ring.current.rotation.z = t * 0.4;
    ring.current.scale.setScalar(0.62 + Math.cos(t * 0.9) * 0.04);
  });
  return (
    <mesh ref={ring} rotation-x={-Math.PI / 2}>
      <ringGeometry args={[0.98, 1, 96, 1, 0, Math.PI * 1.6]} />
      <meshBasicMaterial
        color={color}
        toneMapped={false}
        transparent
        opacity={0.45}
        side={DoubleSide}
        blending={AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
};

const ScanBeam = () => {
  const beam = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (!beam.current) return;
    const t = (clock.getElapsedTime() * 0.35) % 1;
    beam.current.position.y = 0.02 + t * 1.95;
  });
  return (
    <mesh ref={beam} rotation-x={-Math.PI / 2}>
      <ringGeometry args={[0.42, 0.62, 64]} />
      <meshBasicMaterial
        color={palette.ember}
        transparent
        opacity={0.12}
        side={DoubleSide}
        blending={AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
};

const FloorRings = () => {
  const group = useRef<Group>(null);
  useFrame((_, d) => {
    if (group.current) group.current.rotation.z += d * 0.08;
  });
  const ticks = useMemo(() => Array.from({ length: 60 }, (_, i) => (i / 60) * Math.PI * 2), []);
  return (
    <group rotation-x={-Math.PI / 2} position-y={0.002}>
      <group ref={group}>
        <mesh>
          <ringGeometry args={[0.78, 0.785, 128]} />
          <meshBasicMaterial color={palette.brass} transparent opacity={0.6} />
        </mesh>
        {ticks.map((a, i) => (
          <mesh key={a} position={[Math.cos(a) * 0.86, Math.sin(a) * 0.86, 0]} rotation-z={a}>
            <planeGeometry args={[i % 5 === 0 ? 0.07 : 0.03, 0.004]} />
            <meshBasicMaterial color={palette.bone} transparent opacity={i % 5 === 0 ? 0.6 : 0.25} />
          </mesh>
        ))}
      </group>
      <mesh>
        <ringGeometry args={[1.2, 1.203, 128, 1, 0, Math.PI * 1.2]} />
        <meshBasicMaterial color={palette.ember} transparent opacity={0.7} />
      </mesh>
    </group>
  );
};

/** Gym-floor set dressing so the scene reads as training at a glance. */
const GymSet = () => (
  <group>
    <Kettlebell position={[-1.25, 0, -0.55]} rotation-y={0.6} scale={1.25} />
    <Kettlebell position={[-1.62, 0, -0.2]} rotation-y={-0.4} scale={0.95} />
    <Dumbbell position={[1.15, 0.055, 0.55]} rotation-y={-0.7} scale={1.2} />
    <Dumbbell position={[1.32, 0.055, 0.25]} rotation-y={-0.5} scale={1.2} />
    <WeightPlate position={[1.55, 0.225, -0.75]} rotation-y={-0.5} />
    <WeightPlate position={[1.62, 0.225, -0.82]} rotation-y={-0.5} />
    <Float speed={1.2} rotationIntensity={1.2} floatIntensity={1.4}>
      <Dumbbell position={[-1.45, 1.75, -1.4]} rotation={[0.5, 0.3, 0.8]} scale={1.5} />
    </Float>
    <Float speed={1} rotationIntensity={0.8} floatIntensity={1.2}>
      <WeightPlate position={[1.6, 1.6, -1.6]} rotation={[0.3, -0.7, 0.2]} scale={1.1} />
    </Float>
    <Float speed={1.4} rotationIntensity={1} floatIntensity={1}>
      <Kettlebell position={[0.9, 2.15, -2.2]} rotation={[0.3, 0.4, -0.3]} scale={1.1} />
    </Float>
  </group>
);

const Lights = () => (
  <>
    <ambientLight intensity={0.25} />
    <spotLight position={[2.5, 4, 2.5]} angle={0.5} penumbra={0.8} intensity={60} color={palette.bone} />
    <pointLight position={[-2.5, 1.2, -1.5]} intensity={14} color={palette.ember} />
    <pointLight position={[2.2, 0.8, -2]} intensity={8} color={palette.brassHi} />
    <Environment resolution={128}>
      <Lightformer form="rect" intensity={2.5} position={[0, 5, 2]} scale={[6, 1, 1]} color={palette.bone} />
      <Lightformer form="rect" intensity={2} position={[-4, 1, 0]} scale={[1, 4, 1]} color={palette.ember} />
      <Lightformer form="rect" intensity={1.5} position={[4, 1, 0]} scale={[1, 4, 1]} color={palette.brassHi} />
    </Environment>
  </>
);

const HeroScene = ({
  active,
  mode = 'cycle',
  onStats,
  flagKnees,
  scanBeam,
  spin = 0,
}: Props) => {
  const reduced = prefersReducedMotion();
  const cycle = mode === 'cycle';
  const landmarks = useMemo(createLandmarks, []);
  const stats = useMemo(() => ({}) as PoseStats, []);
  return (
    <Canvas
      frameloop={!active ? 'never' : reduced ? 'demand' : 'always'}
      dpr={[1, 1.75]}
      camera={{ position: [0, 1.15, 3.9], fov: 38 }}
      gl={{ antialias: false, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={[palette.ink]} />
      <fog attach="fog" args={[palette.ink, 3.5, 9]} />
      <Director cycle={cycle} />
      <Lights />
      <Turntable spin={spin}>
        <PoseFigure
          mode={mode}
          onStats={onStats}
          flagKnees={flagKnees}
          landmarks={landmarks}
          cloud={false}
          external={cycle ? stats : undefined}
        />
        <Suspense fallback={null}>
          <Athlete
            landmarks={landmarks}
            mode={cycle ? 'clips' : 'drive'}
            stats={stats}
            onStats={cycle ? onStats : undefined}
          />
        </Suspense>
        {scanBeam ? <ScanBeam /> : !cycle && <ScanRing />}
      </Turntable>
      {cycle && <GymSet />}
      <FloorRings />
      <ContactShadows position={[0, 0.001, 0]} opacity={0.6} scale={5} blur={2.4} far={1.5} />
      <Grid
        args={[20, 20]}
        cellSize={0.25}
        cellThickness={0.6}
        cellColor="#2a2622"
        sectionSize={1}
        sectionThickness={1}
        sectionColor="#4a3f31"
        fadeDistance={9}
        fadeStrength={1.6}
        infiniteGrid
      />
      <Sparkles count={70} scale={[4, 2.6, 3]} position={[0, 1.2, 0]} size={1.6} speed={0.25} color={palette.brassHi} opacity={0.5} />
      <EffectComposer multisampling={0}>
        <Bloom intensity={0.75} luminanceThreshold={0.62} luminanceSmoothing={0.25} mipmapBlur />
        <Noise opacity={0.045} premultiply />
        <Vignette offset={0.22} darkness={0.8} />
      </EffectComposer>
    </Canvas>
  );
};

export default HeroScene;
