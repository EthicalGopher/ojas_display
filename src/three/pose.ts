import { Vector3 } from 'three';

/**
 * Procedural stand-in for the 33 MediaPipe Pose landmarks the app tracks.
 * Indices follow MediaPipe's numbering so the bone list reads like the real one.
 */
export const LANDMARK_COUNT = 33;

export const BONES: [number, number][] = [
  // face
  [0, 1], [1, 2], [2, 3], [3, 7], [0, 4], [4, 5], [5, 6], [6, 8], [9, 10],
  // torso
  [11, 12], [11, 23], [12, 24], [23, 24],
  // arms + hands
  [11, 13], [13, 15], [15, 17], [15, 19], [15, 21], [17, 19],
  [12, 14], [14, 16], [16, 18], [16, 20], [16, 22], [18, 20],
  // legs + feet
  [23, 25], [25, 27], [27, 29], [29, 31], [27, 31],
  [24, 26], [26, 28], [28, 30], [30, 32], [28, 32],
];

/** Bones that carry a volumetric point cloud, with their body radius. */
export const BODY_SEGMENTS: { a: number; b: number; r: number; n: number }[] = [
  { a: 23, b: 25, r: 0.075, n: 240 },
  { a: 24, b: 26, r: 0.075, n: 240 },
  { a: 25, b: 27, r: 0.05, n: 180 },
  { a: 26, b: 28, r: 0.05, n: 180 },
  { a: 11, b: 13, r: 0.045, n: 110 },
  { a: 12, b: 14, r: 0.045, n: 110 },
  { a: 13, b: 15, r: 0.036, n: 90 },
  { a: 14, b: 16, r: 0.036, n: 90 },
  { a: 11, b: 23, r: 0.09, n: 220 },
  { a: 12, b: 24, r: 0.09, n: 220 },
];

export type Exercise = 'squat' | 'skip' | 'curl' | 'swing' | 'pushup' | 'jacks' | 'warmup' | 'scan';
/** `cycle` plays squat → skipping → curls → kettlebell swings on a loop. */
export type PoseMode = Exercise | 'cycle';

export type PoseStats = {
  exercise: Exercise;
  /** 0..1 progress through the current rep (depth, curl height, jump height). */
  progress: number;
  /** Joint angle the HUD reports: knee for squats, elbow for curls. */
  angle: number;
  /** Seconds into the current exercise segment. */
  segmentTime: number;
  reps: number;
  /** Rope rotation in radians (skipping only). */
  ropePhase: number;
};

export const PERIOD: Record<Exercise, number> = {
  squat: 2.6,
  skip: 0.62,
  curl: 1.9,
  swing: 2.6,
  pushup: 1.6,
  jacks: 1.1,
  warmup: 2,
  scan: 1,
};
export const CYCLE: Exercise[] = ['squat', 'skip', 'curl', 'swing'];
export const SEGMENT = 9;
const BLEND = 0.9;

/**
 * Body proportions in scene units. Defaults fit the stick figure; when a rigged
 * model loads, its measured bone lengths replace these so the tracking overlay
 * lands exactly on the model's joints.
 */
export const body = {
  thigh: 0.46,
  shin: 0.46,
  torso: 0.53,
  upperArm: 0.28,
  foreArm: 0.26,
  shoulderHalf: 0.2,
  hipHalf: 0.115,
  ankleY: 0.085,
  neck: 0.22,
};

const tmpU = new Vector3();
const tmpN = new Vector3();

/** Two-bone IK in the sagittal plane: knee always bends toward +z. */
const solveKnee = (ankle: Vector3, hip: Vector3, out: Vector3, inward: number) => {
  const { thigh: THIGH, shin: SHIN } = body;
  tmpU.subVectors(hip, ankle);
  const dist = Math.min(tmpU.length(), THIGH + SHIN - 0.002);
  tmpU.normalize();
  const cosA = (SHIN * SHIN + dist * dist - THIGH * THIGH) / (2 * SHIN * dist);
  const a = Math.acos(Math.max(-1, Math.min(1, cosA)));
  tmpN.set(0, -tmpU.z, tmpU.y).normalize();
  out
    .copy(ankle)
    .addScaledVector(tmpU, SHIN * Math.cos(a))
    .addScaledVector(tmpN, SHIN * Math.sin(a));
  out.x = (ankle.x + hip.x) / 2 + inward;
};

const angleAt = (pivot: Vector3, a: Vector3, b: Vector3) => {
  const v1 = tmpU.subVectors(a, pivot).normalize();
  const v2 = tmpN.subVectors(b, pivot).normalize();
  return (Math.acos(Math.max(-1, Math.min(1, v1.dot(v2)))) * 180) / Math.PI;
};

const smooth = (x: number) => x * x * (3 - 2 * x);

export const createLandmarks = () =>
  Array.from({ length: LANDMARK_COUNT }, () => new Vector3());

/** Hands: pinky / index / thumb fanned out from the wrist along the forearm. */
const placeHands = (p: Vector3[]) => {
  for (const [e, w, pk, ix, th, side] of [
    [13, 15, 17, 19, 21, -1],
    [14, 16, 18, 20, 22, 1],
  ] as const) {
    const dir = tmpU.subVectors(p[w], p[e]).normalize().multiplyScalar(0.07);
    p[pk].set(p[w].x + dir.x + side * 0.025, p[w].y + dir.y, p[w].z + dir.z);
    p[ix].set(p[w].x + dir.x * 1.1 - side * 0.015, p[w].y + dir.y * 1.1, p[w].z + dir.z * 1.1);
    p[th].set(p[w].x + dir.x * 0.6 - side * 0.035, p[w].y + dir.y * 0.6, p[w].z + dir.z * 0.6 + 0.01);
  }
};

const placeHead = (p: Vector3[], sy: number, sz: number, lean: number) => {
  const hx = (p[11].x + p[12].x) / 2;
  const hy = sy + Math.cos(lean * 0.6) * body.neck;
  const hz = sz + Math.sin(lean * 0.6) * body.neck + 0.05;
  p[0].set(hx, hy, hz + 0.06);
  p[1].set(hx - 0.022, hy + 0.035, hz + 0.05);
  p[2].set(hx - 0.04, hy + 0.036, hz + 0.045);
  p[3].set(hx - 0.058, hy + 0.034, hz + 0.035);
  p[4].set(hx + 0.022, hy + 0.035, hz + 0.05);
  p[5].set(hx + 0.04, hy + 0.036, hz + 0.045);
  p[6].set(hx + 0.058, hy + 0.034, hz + 0.035);
  p[7].set(hx - 0.085, hy + 0.02, hz - 0.03);
  p[8].set(hx + 0.085, hy + 0.02, hz - 0.03);
  p[9].set(hx - 0.022, hy - 0.035, hz + 0.045);
  p[10].set(hx + 0.022, hy - 0.035, hz + 0.045);
};

/** Writes the 33 landmarks for one exercise at local time `t`. */
const poseExercise = (p: Vector3[], t: number, which: Exercise): PoseStats => {
  // the stick figure only knows squats, skipping and curls; squats stand in for the rest
  // until the model loads
  const ex = which === 'skip' || which === 'curl' || which === 'scan' ? which : 'squat';
  const period = PERIOD[ex];
  const phase = (t % period) / period;
  const breathe = Math.sin(t * 1.6) * 0.006;

  let d = 0; // squat depth
  let lift = 0; // body height off the floor (skipping)
  let progress = 0;
  if (ex === 'squat') {
    d = smooth(0.5 - 0.5 * Math.cos(phase * Math.PI * 2));
    progress = d;
  } else if (ex === 'skip') {
    // rope passes under the feet at phase 0, so that's the top of the hop
    lift = 0.075 * Math.max(0, Math.cos(phase * Math.PI * 2)) ** 1.5;
    progress = lift / 0.075;
  }

  const scan = ex === 'scan';
  const sway = scan ? Math.sin(t * 0.7) * 0.01 : 0;

  // feet (toes point down a little while airborne)
  const footSplay = scan ? 0.11 : 0.05;
  const toeDrop = lift * 0.6;
  const stance = ex === 'skip' ? 0.11 : 0.16;
  const ay = body.ankleY;
  p[27].set(-stance, ay + lift, 0);
  p[28].set(stance, ay + lift, 0);
  p[29].set(-stance - 0.005, 0.03 + lift + toeDrop * 0.5, -0.06);
  p[30].set(stance + 0.005, 0.03 + lift + toeDrop * 0.5, -0.06);
  p[31].set(-stance - 0.01 - footSplay, 0.015 + lift - toeDrop * 0.2, 0.15);
  p[32].set(stance + 0.01 + footSplay, 0.015 + lift - toeDrop * 0.2, 0.15);

  // hips — the scan shows a slightly tilted pelvis, like the app's screenshot
  const softKnee = ex === 'skip' ? 0.03 * (1 - progress) : 0;
  const legLen = body.thigh + body.shin;
  const hipY = ay + legLen * 0.97 - legLen * 0.47 * d - softKnee + breathe + lift;
  const hipZ = -0.3 * d;
  const tilt = scan ? 0.028 : 0;
  p[23].set(-body.hipHalf + sway, hipY - tilt, hipZ);
  p[24].set(body.hipHalf + sway, hipY + tilt * 0.4, hipZ);

  // knees by IK; the scan shows mild valgus (knees caving in)
  const valgus = scan ? 0.045 : 0;
  solveKnee(p[27], p[23], p[25], valgus);
  solveKnee(p[28], p[24], p[26], -valgus);

  // torso leans forward as the hips sink back
  const lean = 0.62 * d + (ex === 'skip' ? 0.05 : 0);
  const torso = body.torso;
  const cx = (p[23].x + p[24].x) / 2;
  const sy = hipY + Math.cos(lean) * torso + breathe;
  const sz = hipZ + Math.sin(lean) * torso;
  p[11].set(cx - body.shoulderHalf, sy, sz);
  p[12].set(cx + body.shoulderHalf, sy, sz);

  let angle = angleAt(p[25], p[23], p[27]);
  let ropePhase = 0;

  if (ex === 'squat' || scan) {
    // arms swing forward to counter-balance
    const theta = scan ? 0.12 : 0.35 + 1.2 * d;
    const theta2 = scan ? 0.08 : theta + 0.1;
    for (const [s, e, w, side] of [
      [11, 13, 15, -1],
      [12, 14, 16, 1],
    ] as const) {
      const flare = scan ? 0.06 : 0.02;
      const ua = body.upperArm;
      const fa = body.foreArm;
      p[e].set(p[s].x + side * flare, p[s].y - Math.cos(theta) * ua, p[s].z + Math.sin(theta) * ua);
      p[w].set(
        p[e].x + side * (scan ? 0.02 : 0.01),
        p[e].y - Math.cos(theta2) * fa,
        p[e].z + Math.sin(theta2) * fa,
      );
    }
  } else if (ex === 'skip') {
    // elbows tucked, wrists drawing small circles that turn the rope
    ropePhase = phase * Math.PI * 2;
    for (const [s, e, w, side] of [
      [11, 13, 15, -1],
      [12, 14, 16, 1],
    ] as const) {
      p[e].set(p[s].x + side * 0.06, p[s].y - body.upperArm * 0.96, p[s].z + 0.03);
      const f = body.foreArm;
      p[w].set(
        p[e].x + side * f * 0.5,
        p[e].y - f * 0.38 + Math.cos(ropePhase) * 0.025,
        p[e].z + f * 0.54 + Math.sin(ropePhase) * 0.025,
      );
    }
  } else {
    // alternating dumbbell curls: elbows pinned, forearms swing up
    let lead = 0;
    for (const [s, e, w, side, offset] of [
      [11, 13, 15, -1, 0],
      [12, 14, 16, 1, 0.5],
    ] as const) {
      const ph = (phase + offset) % 1;
      const c = smooth(Math.max(0, Math.sin(ph * Math.PI * 2)));
      const alpha = 0.15 + c * 2.25;
      p[e].set(p[s].x + side * 0.03, p[s].y - body.upperArm, p[s].z - 0.02);
      p[w].set(p[e].x, p[e].y - Math.cos(alpha) * body.foreArm, p[e].z + Math.sin(alpha) * body.foreArm);
      if (side === -1) {
        lead = c;
      }
    }
    progress = lead;
    angle = angleAt(p[13], p[11], p[15]);
  }

  placeHands(p);
  placeHead(p, sy, sz, lean);

  const reps =
    ex === 'curl' ? Math.floor(t / period) * 2 + (phase > 0.5 ? 1 : 0) : Math.floor(t / period);

  return { exercise: which, progress, angle, segmentTime: t, reps, ropePhase };
};

const blendBuffer = createLandmarks();

/** Writes all 33 landmarks for time `t` into `p` and returns live stats. */
export const computePose = (p: Vector3[], t: number, mode: PoseMode): PoseStats => {
  if (mode !== 'cycle') return poseExercise(p, t, mode);

  const seg = Math.floor(t / SEGMENT);
  const local = t - seg * SEGMENT;
  const ex = CYCLE[seg % CYCLE.length];
  const stats = poseExercise(p, local, ex);
  if (local < BLEND) {
    const prev = CYCLE[(seg + CYCLE.length - 1) % CYCLE.length];
    poseExercise(blendBuffer, SEGMENT + local, prev);
    const k = smooth(local / BLEND);
    for (let i = 0; i < LANDMARK_COUNT; i++) p[i].lerpVectors(blendBuffer[i], p[i], k);
  }
  return stats;
};
