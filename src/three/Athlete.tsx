import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js';
import {
  AnimationMixer,
  Box3,
  LoopRepeat,
  Quaternion,
  Vector3,
  type AnimationAction,
  type Bone,
  type Mesh,
  type Object3D,
} from 'three';
import { CYCLE, SEGMENT, body, type Exercise, type PoseStats } from './pose';

/**
 * Jody, a Mixamo character, with real Mixamo mocap clips baked in by
 * scripts/build-athlete.py: squat, skip, curl, swing, pushup, jacks, warmup.
 */
export const ATHLETE_URL = '/models/athlete.glb';

/** Target height of the model in scene units (matches the pose engine). */
const HEIGHT = 1.7;
const FADE = 0.6;

/**
 * Mixamo bone → MediaPipe landmark. The model faces +z, so its Right side is
 * at -x, where MediaPipe's left-side indices (11, 13, …) sit from the camera.
 */
const LANDMARK_BONES: Record<number, string> = {
  11: 'RightArm', 12: 'LeftArm',
  13: 'RightForeArm', 14: 'LeftForeArm',
  15: 'RightHand', 16: 'LeftHand',
  17: 'RightHandPinky1', 18: 'LeftHandPinky1',
  19: 'RightHandIndex1', 20: 'LeftHandIndex1',
  21: 'RightHandThumb2', 22: 'LeftHandThumb2',
  23: 'RightUpLeg', 24: 'LeftUpLeg',
  25: 'RightLeg', 26: 'LeftLeg',
  27: 'RightFoot', 28: 'LeftFoot',
  31: 'RightToe_End', 32: 'LeftToe_End',
};

/** Face points as offsets in the head bone's frame, in scene units. */
const FACE: Record<number, [number, number, number]> = {
  0: [0, 0.07, 0.11],
  1: [0.02, 0.1, 0.1], 2: [0.035, 0.1, 0.095], 3: [0.05, 0.1, 0.085],
  4: [-0.02, 0.1, 0.1], 5: [-0.035, 0.1, 0.095], 6: [-0.05, 0.1, 0.085],
  7: [0.075, 0.08, 0.0], 8: [-0.075, 0.08, 0.0],
  9: [0.025, 0.035, 0.1], 10: [-0.025, 0.035, 0.1],
};

const AIMS: [string, number | 'hips' | 'shoulders' | 'head', number | 'shoulders' | 'head'][] = [
  ['Spine', 'hips', 'shoulders'],
  ['Neck', 'shoulders', 'head'],
  ['LeftUpLeg', 24, 26],
  ['LeftLeg', 26, 28],
  ['LeftFoot', 28, 32],
  ['RightUpLeg', 23, 25],
  ['RightLeg', 25, 27],
  ['RightFoot', 27, 31],
  ['LeftArm', 12, 14],
  ['LeftForeArm', 14, 16],
  ['LeftHand', 16, 20],
  ['RightArm', 11, 13],
  ['RightForeArm', 13, 15],
  ['RightHand', 15, 19],
];

const findBones = (root: Object3D) => {
  const bones: Record<string, Bone> = {};
  root.traverse((o) => {
    if ((o as Bone).isBone) bones[o.name.replace(/^mixamorig:?/, '')] = o as Bone;
  });
  return bones;
};

const tv = new Vector3();
const tv2 = new Vector3();
const angleAt = (pivot: Vector3, a: Vector3, b: Vector3) => {
  tv.subVectors(a, pivot).normalize();
  tv2.subVectors(b, pivot).normalize();
  return (Math.acos(Math.max(-1, Math.min(1, tv.dot(tv2)))) * 180) / Math.PI;
};

type Props = {
  landmarks: Vector3[];
  /**
   * `clips`: play the mocap and read the 33 landmarks back off the bones, the way
   * the app reads them off a camera. `drive`: bend the bones to follow landmarks
   * the pose engine computes (used for the posture-scan demo).
   */
  mode: 'clips' | 'drive';
  /** Filled every frame in `clips` mode; PoseFigure and the HUD read it. */
  stats?: PoseStats;
  onStats?: (stats: PoseStats) => void;
};

/** Realistic rigged athlete, either playing mocap or following the pose engine. */
export const Athlete = ({ landmarks, mode, stats, onStats }: Props) => {
  const gltf = useGLTF(ATHLETE_URL);
  // Each canvas needs its own copy: a three.js object can only have one parent.
  const scene = useMemo(() => cloneSkinned(gltf.scene), [gltf.scene]);
  const bones = useMemo(() => findBones(scene), [scene]);
  const rest = useMemo(() => {
    const m = new Map<Bone, Quaternion>();
    Object.values(bones).forEach((b) => m.set(b, b.quaternion.clone()));
    return m;
  }, [bones]);

  const mixer = useMemo(() => new AnimationMixer(scene), [scene]);
  const actions = useMemo(() => {
    const out: Partial<Record<string, AnimationAction>> = {};
    gltf.animations.forEach((clip) => {
      const a = mixer.clipAction(clip);
      a.setLoop(LoopRepeat, Infinity);
      out[clip.name] = a;
    });
    return out;
  }, [gltf.animations, mixer]);
  useEffect(() => () => void mixer.stopAllAction(), [mixer]);
  useEffect(() => {
    window.dispatchEvent(new Event('ojas:ready'));
  }, []);

  // Fit the model to HEIGHT and stand it on the floor; in drive mode also hand
  // its bone lengths to the pose engine so landmarks line up with its joints.
  useLayoutEffect(() => {
    scene.traverse((o) => {
      const m = o as Mesh;
      if (m.isMesh) {
        m.castShadow = true;
        m.frustumCulled = false;
      }
    });
    scene.scale.setScalar(1);
    scene.position.set(0, 0, 0);
    scene.updateMatrixWorld(true);
    const box = new Box3().setFromObject(scene);
    scene.scale.setScalar(HEIGHT / (box.max.y - box.min.y));
    scene.updateMatrixWorld(true);
    box.setFromObject(scene);
    scene.position.y -= box.min.y;
    scene.updateMatrixWorld(true);

    if (!bones.Hips) return;
    const p = (name: string) => bones[name].getWorldPosition(new Vector3());
    if (mode !== 'drive') return;
    const d = (a: string, c: string) => p(a).distanceTo(p(c));
    body.thigh = d('LeftUpLeg', 'LeftLeg');
    body.shin = d('LeftLeg', 'LeftFoot');
    body.upperArm = d('LeftArm', 'LeftForeArm');
    body.foreArm = d('LeftForeArm', 'LeftHand');
    body.shoulderHalf = Math.abs(p('LeftArm').x - p('RightArm').x) / 2;
    body.hipHalf = Math.abs(p('LeftUpLeg').x - p('RightUpLeg').x) / 2;
    body.ankleY = p('LeftFoot').y;
    const shoulderY = (p('LeftArm').y + p('RightArm').y) / 2;
    body.torso = shoulderY - (p('LeftUpLeg').y + p('RightUpLeg').y) / 2;
    body.neck = p('Head').y - shoulderY + 0.06;
  }, [scene, bones, mode]);

  const track = useRef({
    current: '' as Exercise | '',
    standHip: 0,
    footFloor: Infinity,
    armed: false,
    reps: 0,
    lastPeak: 0,
    period: 0.6,
    footWasUp: false,
  });

  const tmp = useMemo(
    () => ({
      from: new Vector3(),
      to: new Vector3(),
      a: new Vector3(),
      c: new Vector3(),
      want: new Vector3(),
      have: new Vector3(),
      q: new Quaternion(),
      wq: new Quaternion(),
      pq: new Quaternion(),
      hips: new Vector3(),
    }),
    [],
  );

  const point = (key: number | 'hips' | 'shoulders' | 'head', out: Vector3) => {
    if (key === 'hips') return out.addVectors(landmarks[23], landmarks[24]).multiplyScalar(0.5);
    if (key === 'shoulders') return out.addVectors(landmarks[11], landmarks[12]).multiplyScalar(0.5);
    if (key === 'head') return out.addVectors(landmarks[7], landmarks[8]).multiplyScalar(0.5);
    return out.copy(landmarks[key]);
  };

  /** Bend bones, parents first, from rest toward the pose engine's landmarks. */
  const drive = () => {
    const hips = bones.Hips;
    if (!hips) return;
    point('hips', tmp.hips);
    hips.quaternion.copy(rest.get(hips)!);
    if (hips.parent) {
      hips.parent.updateWorldMatrix(true, false);
      hips.position.copy(hips.parent.worldToLocal(tmp.hips.clone()));
    }
    hips.updateMatrixWorld(true);
    for (const [name, fromKey, toKey] of AIMS) {
      const bone = bones[name];
      const child = bone?.children.find((c) => (c as Bone).isBone);
      if (!bone || !child) continue;
      bone.quaternion.copy(rest.get(bone)!);
      bone.updateMatrixWorld(true);
      bone.getWorldPosition(tmp.a);
      child.getWorldPosition(tmp.c);
      tmp.have.subVectors(tmp.c, tmp.a).normalize();
      tmp.want.subVectors(point(toKey, tmp.to), point(fromKey, tmp.from)).normalize();
      tmp.q.setFromUnitVectors(tmp.have, tmp.want);
      bone.getWorldQuaternion(tmp.wq).premultiply(tmp.q);
      bone.parent!.getWorldQuaternion(tmp.pq);
      bone.quaternion.copy(tmp.pq.invert().multiply(tmp.wq));
      bone.updateMatrixWorld(true);
    }
  };

  /** Read the 33 landmarks back off the animated skeleton. */
  const read = () => {
    scene.updateMatrixWorld(true);
    for (const [idx, name] of Object.entries(LANDMARK_BONES)) {
      bones[name]?.getWorldPosition(landmarks[+idx]);
    }
    // heels: just behind and below the ankle
    for (const [heel, ankle, toe] of [
      [29, 27, 31],
      [30, 28, 32],
    ]) {
      tmp.a.subVectors(landmarks[toe], landmarks[ankle]).multiplyScalar(-0.35);
      landmarks[heel].copy(landmarks[ankle]).add(tmp.a);
      landmarks[heel].y = Math.min(landmarks[heel].y, landmarks[ankle].y - 0.05);
    }
    const head = bones.Head;
    if (head) {
      // undo the head's world scale so the offsets stay in scene units
      const k = 1 / head.getWorldScale(tmp.c).x;
      for (const [idx, [x, y, z]] of Object.entries(FACE)) {
        landmarks[+idx].set(x * k, y * k, z * k).applyMatrix4(head.matrixWorld);
      }
    }
  };

  useFrame(({ clock }, delta) => {
    if (mode === 'drive') {
      drive();
      return;
    }
    const t = clock.getElapsedTime();
    const ex = CYCLE[Math.floor(t / SEGMENT) % CYCLE.length];
    const tr = track.current;
    if (ex !== tr.current) {
      const next = actions[ex];
      const prev = tr.current ? actions[tr.current] : undefined;
      if (next) {
        next.reset().setEffectiveWeight(1).play();
        if (prev) prev.crossFadeTo(next, FADE, false);
      }
      tr.current = ex;
      tr.reps = 0;
      tr.armed = false;
    }
    mixer.update(Math.min(delta, 0.1));
    read();

    // live stats, measured from the landmarks like the app does
    const hipY = (landmarks[23].y + landmarks[24].y) / 2;
    tr.standHip = Math.max(tr.standHip - delta * 0.002, hipY);
    const footY = Math.min(landmarks[31].y, landmarks[32].y);
    tr.footFloor = Math.min(tr.footFloor + delta * 0.01, footY);

    let progress = 0;
    let angle = 0;
    if (ex === 'squat') {
      progress = (tr.standHip - hipY) / (tr.standHip * 0.4);
      angle = angleAt(landmarks[25], landmarks[23], landmarks[27]);
    } else if (ex === 'skip') {
      progress = (footY - tr.footFloor) / 0.035;
    } else if (ex === 'curl') {
      const l = angleAt(landmarks[13], landmarks[11], landmarks[15]);
      const r = angleAt(landmarks[14], landmarks[12], landmarks[16]);
      angle = Math.min(l, r);
      progress = (165 - angle) / 125;
    } else {
      angle = angleAt(landmarks[23], landmarks[11], landmarks[25]);
      progress = (180 - angle) / 90;
    }
    progress = Math.min(1, Math.max(0, progress));

    // a rep counts on the way back out of the hard part of the movement
    if (progress > 0.75) tr.armed = true;
    if (tr.armed && progress < 0.25) {
      tr.armed = false;
      tr.reps += 1;
    }

    // rope phase: the rope passes under the feet at the top of each hop
    if (ex === 'skip') {
      const up = progress > 0.55;
      if (up && !tr.footWasUp) {
        const gap = t - tr.lastPeak;
        if (gap > 0.25 && gap < 1.2) tr.period = tr.period * 0.7 + gap * 0.3;
        tr.lastPeak = t;
      }
      tr.footWasUp = up;
    }
    const ropePhase = (((t - tr.lastPeak) / tr.period) % 1) * Math.PI * 2;

    const out = stats ?? ({} as PoseStats);
    out.exercise = ex;
    out.progress = progress;
    out.angle = angle;
    out.segmentTime = t % SEGMENT;
    out.reps = tr.reps;
    out.ropePhase = ropePhase;
    onStats?.(out);
  }, -1);

  return <primitive object={scene} />;
};

useGLTF.preload(ATHLETE_URL);
