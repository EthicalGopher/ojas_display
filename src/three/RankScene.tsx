import { useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, Lightformer } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { Color, type Group } from 'three';
import { rankTiers } from '../data';
import { palette } from './palette';
import { prefersReducedMotion } from './useInView';

type GemProps = {
  index: number;
  color: string;
  position: [number, number, number];
  selected: boolean;
  onSelect: () => void;
};

/** Each tier gets a richer cut: more facets, more rings as you climb. */
const Core = ({ index, color }: { index: number; color: string }) => {
  const mat = (
    <meshPhysicalMaterial
      color={color}
      metalness={index === 4 ? 0.1 : 0.75}
      roughness={index === 4 ? 0.05 : 0.28}
      clearcoat={1}
      clearcoatRoughness={0.15}
      transmission={index === 4 ? 0.9 : 0}
      thickness={0.6}
      ior={2.4}
      emissive={index === 5 ? new Color(color).multiplyScalar(0.6) : '#000000'}
      flatShading
    />
  );
  switch (index) {
    case 0:
      return <mesh rotation-x={Math.PI / 2}><cylinderGeometry args={[0.36, 0.36, 0.14, 6]} />{mat}</mesh>;
    case 1:
      return <mesh rotation-x={Math.PI / 2}><cylinderGeometry args={[0.38, 0.3, 0.16, 8]} />{mat}</mesh>;
    case 2:
      return <mesh><dodecahedronGeometry args={[0.34]} />{mat}</mesh>;
    case 3:
      return <mesh><icosahedronGeometry args={[0.36]} />{mat}</mesh>;
    case 4:
      return <mesh scale={[1, 1.35, 1]}><octahedronGeometry args={[0.34]} />{mat}</mesh>;
    default:
      return <mesh><icosahedronGeometry args={[0.34, 1]} />{mat}</mesh>;
  }
};

const Gem = ({ index, color, position, selected, onSelect }: GemProps) => {
  const group = useRef<Group>(null);
  const rings = useRef<Group>(null);
  const [hover, setHover] = useState(false);

  useFrame((_, d) => {
    if (!group.current || !rings.current) return;
    group.current.rotation.y += d * (selected || hover ? 1.4 : 0.45);
    rings.current.rotation.z += d * 0.6;
    rings.current.rotation.x += d * 0.25;
    const target = selected ? 1.18 : hover ? 1.08 : 0.92;
    const s = group.current.scale.x + (target - group.current.scale.x) * Math.min(1, d * 6);
    group.current.scale.setScalar(s);
  });

  const ringCount = Math.min(3, Math.floor(index / 2) + 1);
  const glow = new Color(color).multiplyScalar(index === 5 ? 3 : 1.6);

  return (
    <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.5}>
      <group
        position={position}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHover(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHover(false);
          document.body.style.cursor = '';
        }}
      >
        <group ref={group}>
          <Core index={index} color={color} />
        </group>
        <group ref={rings}>
          {Array.from({ length: ringCount }, (_, r) => (
            <mesh key={r} rotation={[Math.PI / 2 + r * 0.9, r * 0.6, 0]}>
              <torusGeometry args={[0.52 + r * 0.07, 0.006, 8, 96]} />
              <meshBasicMaterial color={glow} toneMapped={false} transparent opacity={selected ? 0.95 : 0.45} />
            </mesh>
          ))}
        </group>
      </group>
    </Float>
  );
};

const Layout = ({ selected, onSelect }: { selected: number; onSelect: (i: number) => void }) => {
  const { size } = useThree();
  const narrow = size.width < 620;
  const cols = narrow ? 3 : 6;
  const gapX = narrow ? 1.2 : 1.55;
  const gapY = 1.45;
  return (
    <group position={[0, narrow ? 0.6 : 0, 0]} scale={narrow ? 0.8 : 1}>
      {rankTiers.map((tier, i) => {
        const c = i % cols;
        const r = Math.floor(i / cols);
        const x = (c - (cols - 1) / 2) * gapX;
        const y = -r * gapY;
        return (
          <Gem
            key={tier.tier}
            index={i}
            color={tier.color}
            position={[x, y, 0]}
            selected={selected === i}
            onSelect={() => onSelect(i)}
          />
        );
      })}
    </group>
  );
};

const RankScene = ({
  active,
  selected,
  onSelect,
}: {
  active: boolean;
  selected: number;
  onSelect: (i: number) => void;
}) => (
  <Canvas
    frameloop={!active ? 'never' : prefersReducedMotion() ? 'demand' : 'always'}
    dpr={[1, 1.75]}
    camera={{ position: [0, 0, 4.4], fov: 40 }}
    gl={{ antialias: true }}
  >
    <color attach="background" args={[palette.panel]} />
    <ambientLight intensity={0.6} />
    <directionalLight position={[3, 4, 5]} intensity={2.2} color={palette.bone} />
    <pointLight position={[-4, -2, 3]} intensity={18} color={palette.ember} />
    <Environment resolution={256}>
      <Lightformer form="rect" intensity={6} position={[0, 4, 3]} scale={[8, 1.5, 1]} color={palette.bone} />
      <Lightformer form="rect" intensity={4} position={[-5, 0, 2]} scale={[1, 6, 1]} color={palette.brassHi} />
      <Lightformer form="rect" intensity={3} position={[5, -1, 2]} scale={[1, 6, 1]} color={palette.ember} />
      <Lightformer form="ring" intensity={2} position={[0, 0, -4]} scale={4} color={palette.bone} />
    </Environment>
    <Layout selected={selected} onSelect={onSelect} />
    <EffectComposer multisampling={0}>
      <Bloom intensity={0.8} luminanceThreshold={0.7} mipmapBlur />
    </EffectComposer>
  </Canvas>
);

export default RankScene;
