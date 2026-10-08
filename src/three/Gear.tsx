import { forwardRef, useMemo } from 'react';
import { Vector2, type Group } from 'three';
import type { ThreeElements } from '@react-three/fiber';
import { palette } from './palette';

/** Shared looks: cast iron, knurled steel, rubber and a brass accent. */
export const Iron = () => (
  <meshPhysicalMaterial color="#1c1a18" metalness={0.85} roughness={0.42} clearcoat={0.3} />
);
const Steel = () => <meshStandardMaterial color="#b9b2a6" metalness={1} roughness={0.28} />;
const Rubber = () => <meshStandardMaterial color="#141312" metalness={0.1} roughness={0.75} />;
const Brass = () => <meshStandardMaterial color={palette.brass} metalness={1} roughness={0.25} />;
const Ember = () => (
  <meshStandardMaterial color={palette.ember} metalness={0.3} roughness={0.4} emissive={palette.ember} emissiveIntensity={0.35} />
);

type GearProps = ThreeElements['group'];

/** Hex dumbbell, handle along the x axis. ~0.3 units long at scale 1. */
export const Dumbbell = forwardRef<Group, GearProps>((props, ref) => (
  <group ref={ref} {...props}>
    <mesh rotation-z={Math.PI / 2}>
      <cylinderGeometry args={[0.014, 0.014, 0.17, 16]} />
      <Steel />
    </mesh>
    {[-1, 1].map((s) => (
      <group key={s} position-x={s * 0.115}>
        <mesh rotation-z={Math.PI / 2}>
          <cylinderGeometry args={[0.055, 0.055, 0.06, 6]} />
          <Rubber />
        </mesh>
        <mesh rotation-z={Math.PI / 2} position-x={s * 0.031}>
          <cylinderGeometry args={[0.026, 0.026, 0.004, 24]} />
          <Brass />
        </mesh>
        <mesh rotation-z={Math.PI / 2} position-x={-s * 0.034}>
          <cylinderGeometry args={[0.022, 0.022, 0.008, 16]} />
          <Steel />
        </mesh>
      </group>
    ))}
  </group>
));
Dumbbell.displayName = 'Dumbbell';

export const Kettlebell = (props: GearProps) => (
  <group {...props}>
    <mesh position-y={0.12} scale={[1, 0.92, 1]}>
      <sphereGeometry args={[0.13, 40, 28]} />
      <Iron />
    </mesh>
    <mesh position-y={0.012}>
      <cylinderGeometry args={[0.085, 0.09, 0.024, 32]} />
      <Iron />
    </mesh>
    <mesh position-y={0.235}>
      <cylinderGeometry args={[0.07, 0.09, 0.05, 32]} />
      <Iron />
    </mesh>
    <mesh position-y={0.27}>
      <torusGeometry args={[0.075, 0.015, 16, 48, Math.PI]} />
      <Iron />
    </mesh>
    {/* weight band */}
    <mesh position-y={0.12} rotation-x={Math.PI / 2}>
      <torusGeometry args={[0.131, 0.004, 8, 64]} />
      <Ember />
    </mesh>
  </group>
);

/** Bumper plate from a lathe profile, standing on its edge. */
export const WeightPlate = (props: GearProps) => {
  const points = useMemo(
    () =>
      [
        [0.03, -0.012], [0.05, -0.012], [0.055, -0.02], [0.2, -0.02], [0.215, -0.028],
        [0.225, -0.022], [0.225, 0.022], [0.215, 0.028], [0.2, 0.02], [0.055, 0.02],
        [0.05, 0.012], [0.03, 0.012],
      ].map(([x, y]) => new Vector2(x, y)),
    [],
  );
  return (
    <group {...props}>
      <mesh rotation-x={Math.PI / 2}>
        <latheGeometry args={[points, 64]} />
        <Rubber />
      </mesh>
      <mesh>
        <torusGeometry args={[0.04, 0.008, 12, 40]} />
        <Steel />
      </mesh>
      <mesh position-z={0.021}>
        <ringGeometry args={[0.14, 0.15, 64]} />
        <meshBasicMaterial color={palette.ember} toneMapped={false} />
      </mesh>
    </group>
  );
};

/** Skipping rope handle, long axis on y. */
export const RopeHandle = forwardRef<Group, GearProps>((props, ref) => (
  <group ref={ref} {...props}>
    <mesh>
      <cylinderGeometry args={[0.016, 0.013, 0.12, 16]} />
      <Ember />
    </mesh>
    <mesh position-y={0.065}>
      <cylinderGeometry args={[0.009, 0.009, 0.014, 12]} />
      <Brass />
    </mesh>
  </group>
));
RopeHandle.displayName = 'RopeHandle';
