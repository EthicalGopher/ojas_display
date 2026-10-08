import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  CylinderGeometry,
  Line,
  LineBasicMaterial,
  Matrix4,
  Object3D,
  Quaternion,
  SphereGeometry,
  Vector3,
  type Group,
  type InstancedMesh,
} from 'three';
import {
  BODY_SEGMENTS,
  BONES,
  LANDMARK_COUNT,
  computePose,
  createLandmarks,
  type PoseMode,
  type PoseStats,
} from './pose';
import { Dumbbell, Kettlebell, RopeHandle } from './Gear';
import { palette } from './palette';

type Props = {
  mode: PoseMode;
  onStats?: (stats: PoseStats) => void;
  /** Highlights the knees in the warning color (posture scan). */
  flagKnees?: boolean;
  /** Shared landmark buffer, so a rigged model can follow the same pose. */
  landmarks?: Vector3[];
  /** Volumetric point cloud around the bones (off when a real body is shown). */
  cloud?: boolean;
  /**
   * Stats from a mocap-driven model that already wrote the landmarks this frame.
   * While it is still empty (model loading) the figure animates itself.
   */
  external?: PoseStats;
};

const UP = new Vector3(0, 1, 0);
const ARC_POINTS = 24;
const ROPE_BEADS = 120;
const FLAGGED = new Set([25, 26]);

const ease = (from: number, on: boolean, delta: number) =>
  from + ((on ? 1 : 0) - from) * Math.min(1, delta * 7);

/** Places a gear piece at a hand and scales it in or out. */
const place = (g: Group | null, at: Vector3, k: number) => {
  if (!g) return;
  g.position.copy(at);
  // stays in the scene at near-zero scale so its shaders compile up front (no hitch on first use)
  g.scale.setScalar(Math.max(k, 0.0001));
};

export const PoseFigure = ({
  mode,
  onStats,
  flagKnees = false,
  landmarks: shared,
  cloud = true,
  external,
}: Props) => {
  const joints = useRef<InstancedMesh>(null);
  const halos = useRef<InstancedMesh>(null);
  const bones = useRef<InstancedMesh>(null);
  const rope = useRef<InstancedMesh>(null);
  const handleL = useRef<Group>(null);
  const handleR = useRef<Group>(null);
  const bellL = useRef<Group>(null);
  const bellR = useRef<Group>(null);
  const kettle = useRef<Group>(null);
  const gear = useRef({ bells: 0, rope: 0, kettle: 0 });
  const own = useMemo(createLandmarks, []);
  const landmarks = shared ?? own;

  const dummy = useMemo(() => new Object3D(), []);
  const tmp = useMemo(
    () => ({
      dir: new Vector3(),
      mid: new Vector3(),
      q: new Quaternion(),
      m: new Matrix4(),
      a: new Vector3(),
      b: new Vector3(),
      e1: new Vector3(),
      e2: new Vector3(),
      axis: new Vector3(),
    }),
    [],
  );

  const jointGeo = useMemo(() => new SphereGeometry(1, 16, 12), []);
  const boneGeo = useMemo(() => new CylinderGeometry(1, 1, 1, 6, 1, true), []);
  const beadGeo = useMemo(() => new SphereGeometry(1, 6, 4), []);

  // Point cloud: each particle rides a bone at fixed (t, angle, radius).
  const cloudData = useMemo(() => {
    const seeds: { seg: number; t: number; phi: number; r: number }[] = [];
    BODY_SEGMENTS.forEach((seg, i) => {
      for (let k = 0; k < seg.n; k++) {
        seeds.push({
          seg: i,
          t: Math.random(),
          phi: Math.random() * Math.PI * 2,
          r: seg.r * (0.75 + Math.random() * 0.35),
        });
      }
    });
    const headSeeds = 260;
    const geo = new BufferGeometry();
    const positions = new Float32Array((seeds.length + headSeeds) * 3);
    geo.setAttribute('position', new BufferAttribute(positions, 3));
    const head = Array.from({ length: headSeeds }, () => {
      const u = Math.random() * 2 - 1;
      const th = Math.random() * Math.PI * 2;
      const s = Math.sqrt(1 - u * u);
      return new Vector3(s * Math.cos(th) * 0.085, u * 0.11, s * Math.sin(th) * 0.09);
    });
    return { seeds, head, geo, positions };
  }, []);

  const arcGeo = useMemo(() => {
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(new Float32Array(ARC_POINTS * 3), 3));
    return g;
  }, []);
  const arcLine = useMemo(
    () =>
      new Line(
        arcGeo,
        new LineBasicMaterial({ color: palette.brassHi, transparent: true, opacity: 0.9 }),
      ),
    [arcGeo],
  );

  const colors = useMemo(
    () => ({
      ok: new Color(palette.ember).multiplyScalar(1.7),
      warn: new Color(palette.alert).multiplyScalar(2.6),
      bone: new Color(palette.brass).multiplyScalar(1.6),
      rope: new Color(palette.bone).multiplyScalar(1.3),
    }),
    [],
  );

  // Instance colors must exist before the first render so the shader compiles with them.
  useLayoutEffect(() => {
    for (let i = 0; i < LANDMARK_COUNT; i++) {
      const c = flagKnees && FLAGGED.has(i) ? colors.warn : colors.ok;
      joints.current?.setColorAt(i, c);
      halos.current?.setColorAt(i, c);
    }
  }, [colors, flagKnees]);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    const driven = external?.exercise !== undefined;
    const stats = driven ? external! : computePose(landmarks, t, mode);
    if (!driven) onStats?.(stats);
    const ex = stats.exercise;

    const jm = joints.current;
    const hm = halos.current;
    const bm = bones.current;
    if (!jm || !hm || !bm) return;

    for (let i = 0; i < LANDMARK_COUNT; i++) {
      const small = i <= 10 || (i >= 17 && i <= 22);
      const s = (small ? 0.011 : 0.022) * (cloud ? 1 : 0.7);
      dummy.position.copy(landmarks[i]);
      dummy.quaternion.identity();
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      jm.setMatrixAt(i, dummy.matrix);
      const pulse = flagKnees && FLAGGED.has(i) ? 3 + Math.sin(t * 6) * 0.7 : 1.8;
      dummy.scale.setScalar(s * pulse);
      dummy.updateMatrix();
      hm.setMatrixAt(i, dummy.matrix);
    }
    jm.instanceMatrix.needsUpdate = true;
    hm.instanceMatrix.needsUpdate = true;

    BONES.forEach(([a, b], i) => {
      const pa = landmarks[a];
      const pb = landmarks[b];
      tmp.dir.subVectors(pb, pa);
      const len = tmp.dir.length();
      tmp.mid.addVectors(pa, pb).multiplyScalar(0.5);
      tmp.q.setFromUnitVectors(UP, tmp.dir.normalize());
      const thick = (a <= 10 || (a >= 15 && a <= 22) ? 0.0035 : 0.0065) * (cloud ? 1 : 0.6);
      tmp.m.compose(tmp.mid, tmp.q, dummy.scale.set(thick, len, thick));
      bm.setMatrixAt(i, tmp.m);
    });
    bm.instanceMatrix.needsUpdate = true;

    // point cloud
    const { seeds, head, positions, geo } = cloudData;
    if (cloud) {
    const { e1, e2, axis } = tmp;
    let segIdx = -1;
    let a = landmarks[0];
    seeds.forEach((s, i) => {
      if (s.seg !== segIdx) {
        segIdx = s.seg;
        const seg = BODY_SEGMENTS[segIdx];
        a = landmarks[seg.a];
        axis.subVectors(landmarks[seg.b], a);
        tmp.dir.copy(axis).normalize();
        e1.set(1, 0, 0);
        if (Math.abs(tmp.dir.x) > 0.9) e1.set(0, 0, 1);
        e1.cross(tmp.dir).normalize();
        e2.crossVectors(tmp.dir, e1).normalize();
      }
      const shimmer = 1 + Math.sin(t * 2 + i) * 0.04;
      const cp = Math.cos(s.phi + t * 0.15) * s.r * shimmer;
      const sp = Math.sin(s.phi + t * 0.15) * s.r * shimmer;
      positions[i * 3] = a.x + axis.x * s.t + e1.x * cp + e2.x * sp;
      positions[i * 3 + 1] = a.y + axis.y * s.t + e1.y * cp + e2.y * sp;
      positions[i * 3 + 2] = a.z + axis.z * s.t + e1.z * cp + e2.z * sp;
    });
    const hc = landmarks[0];
    head.forEach((h, k) => {
      const i = seeds.length + k;
      positions[i * 3] = hc.x + h.x;
      positions[i * 3 + 1] = hc.y + h.y + 0.02;
      positions[i * 3 + 2] = hc.z + h.z - 0.07;
    });
    geo.attributes.position.needsUpdate = true;
    }

    // angle arc: knee during squats, elbow during curls
    const arcOn = ex === 'squat' || ex === 'curl';
    arcLine.visible = arcOn;
    if (arcOn) {
      const [pivot, from, to] = ex === 'squat' ? [25, 23, 27] : [13, 11, 15];
      const k = landmarks[pivot];
      tmp.a.subVectors(landmarks[from], k).normalize();
      tmp.b.subVectors(landmarks[to], k).normalize();
      const arr = arcGeo.attributes.position.array as Float32Array;
      for (let j = 0; j < ARC_POINTS; j++) {
        const f = j / (ARC_POINTS - 1);
        tmp.dir.copy(tmp.a).lerp(tmp.b, f).normalize().multiplyScalar(0.1);
        arr[j * 3] = k.x + tmp.dir.x - 0.004;
        arr[j * 3 + 1] = k.y + tmp.dir.y;
        arr[j * 3 + 2] = k.z + tmp.dir.z;
      }
      arcGeo.attributes.position.needsUpdate = true;
    }

    if (mode !== 'cycle') return;

    // hand centers drive the gear
    const hl = tmp.a.addVectors(landmarks[15], landmarks[19]).multiplyScalar(0.5);
    const hr = tmp.b.addVectors(landmarks[16], landmarks[20]).multiplyScalar(0.5);
    gear.current.bells = ease(gear.current.bells, ex === 'curl', delta);
    gear.current.rope = ease(gear.current.rope, ex === 'skip', delta);
    gear.current.kettle = ease(gear.current.kettle, ex === 'swing', delta);

    // kettlebell hangs from both hands during swings
    tmp.mid.addVectors(hl, hr).multiplyScalar(0.5);
    tmp.mid.y -= 0.2;
    place(kettle.current, tmp.mid, gear.current.kettle);

    // dumbbells ride in the fists during curls
    place(bellL.current, hl, gear.current.bells);
    place(bellR.current, hr, gear.current.bells);

    // skipping rope: a loop between the handles swinging around the body
    const k = gear.current.rope;
    place(handleL.current, hl, k);
    place(handleR.current, hr, k);
    const rm = rope.current;
    if (!rm) return;
    const phi = stats.ropePhase;
    const yc = (hl.y + hr.y) / 2;
    const zc = (hl.z + hr.z) / 2 - 0.05;
    // tall enough to clear the head, low enough to skim the floor
    const ry = 0.84 + 0.25 * (0.5 - 0.5 * Math.cos(phi));
    for (let j = 0; j < ROPE_BEADS; j++) {
      const s = j / (ROPE_BEADS - 1);
      const bow = Math.sin(Math.PI * s) ** 0.7;
      const x = hl.x * (1 - s) + hr.x * s + (s - 0.5) * 0.14 * bow;
      const y = (hl.y * (1 - s) + hr.y * s) * (1 - bow) + (yc - ry * Math.cos(phi)) * bow;
      const z = (hl.z * (1 - s) + hr.z * s) * (1 - bow) + (zc + 0.42 * Math.sin(phi)) * bow;
      dummy.position.set(x, y, z);
      dummy.quaternion.identity();
      dummy.scale.setScalar(0.0065 * k);
      dummy.updateMatrix();
      rm.setMatrixAt(j, dummy.matrix);
    }
    rm.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      {/* drawn over the body, like the camera overlay in the app */}
      <instancedMesh ref={joints} args={[jointGeo, undefined, LANDMARK_COUNT]} frustumCulled={false} renderOrder={10}>
        <meshBasicMaterial toneMapped={false} depthTest={cloud} transparent opacity={0.95} />
      </instancedMesh>
      <instancedMesh ref={halos} args={[jointGeo, undefined, LANDMARK_COUNT]} frustumCulled={false} renderOrder={10}>
        <meshBasicMaterial
          toneMapped={false}
          transparent
          opacity={0.1}
          depthWrite={false}
          depthTest={cloud}
          blending={AdditiveBlending}
        />
      </instancedMesh>
      <instancedMesh ref={bones} args={[boneGeo, undefined, BONES.length]} frustumCulled={false} renderOrder={9}>
        <meshBasicMaterial color={colors.bone} toneMapped={false} depthTest={cloud} transparent opacity={cloud ? 1 : 0.55} />
      </instancedMesh>
      <points geometry={cloudData.geo} frustumCulled={false} visible={cloud}>
        <pointsMaterial
          size={0.0075}
          color={palette.bone}
          transparent
          opacity={0.42}
          depthWrite={false}
          blending={AdditiveBlending}
          sizeAttenuation
        />
      </points>
      <primitive object={arcLine} frustumCulled={false} />

      {mode === 'cycle' && (
        <>
          <group ref={kettle} scale={0.0001}>
            <Kettlebell />
          </group>
          <Dumbbell ref={bellL} scale={0.0001} />
          <Dumbbell ref={bellR} scale={0.0001} />
          <instancedMesh ref={rope} args={[beadGeo, undefined, ROPE_BEADS]} frustumCulled={false}>
            <meshBasicMaterial color={colors.rope} toneMapped={false} />
          </instancedMesh>
          <RopeHandle ref={handleL} scale={0.0001} />
          <RopeHandle ref={handleR} scale={0.0001} />
        </>
      )}
    </group>
  );
};
