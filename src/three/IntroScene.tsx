import { Suspense, memo, useEffect, useLayoutEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { AnimationMixer, Box3, LoopRepeat, Vector3, type Mesh, type OrthographicCamera } from 'three';
import { palette } from './palette';

/** Adam, a Mixamo character, with the Mixamo "Pushing" mocap baked in by scripts/build-athlete.py. */
const PUSHER_URL = '/models/pusher.glb';
export const PUSHER_READY_EVENT = 'ojas:pusher-ready';

const HEIGHT = 1.8;
/** World units visible top to bottom: his height plus a little headroom. */
const VIEW_HEIGHT = 2.0;
/** How far in front of his hips his hands land, so they touch the canvas's right edge. */
const HANDS_REACH = 0.72;

const Pusher = () => {
  const { scene, animations } = useGLTF(PUSHER_URL);
  const mixer = useMemo(() => new AnimationMixer(scene), [scene]);

  useLayoutEffect(() => {
    scene.traverse((o) => {
      if ((o as Mesh).isMesh) (o as Mesh).frustumCulled = false;
    });
    scene.scale.setScalar(1);
    scene.position.set(0, 0, 0);
    scene.rotation.set(0, Math.PI / 2, 0); // face +x, toward the wordmark
    scene.updateMatrixWorld(true);
    const box = new Box3().setFromObject(scene);
    scene.scale.setScalar(HEIGHT / (box.max.y - box.min.y));
    scene.updateMatrixWorld(true);
    box.setFromObject(scene);
    scene.position.y -= box.min.y;

    const clip = animations.find((a) => a.name === 'push') ?? animations[0];
    if (!clip) return;
    mixer.clipAction(clip).setLoop(LoopRepeat, Infinity).play();
    window.dispatchEvent(new Event(PUSHER_READY_EVENT));
    return () => void mixer.stopAllAction();
  }, [scene, animations, mixer]);

  const bones = useMemo(() => {
    const find = (n: string) => scene.getObjectByName(`mixamorig${n}`) ?? scene.getObjectByName(`mixamorig:${n}`);
    return { hips: find('Hips'), feet: ['LeftToeBase', 'RightToeBase', 'LeftFoot', 'RightFoot'].map(find).filter(Boolean) };
  }, [scene]);
  const p = useMemo(() => new Vector3(), []);

  useFrame((_, delta) => {
    mixer.update(Math.min(delta, 0.1));
    // walk in place (the CSS slide moves him) and keep the lowest foot planted on the floor
    scene.updateMatrixWorld(true);
    if (bones.hips) scene.position.x -= bones.hips.getWorldPosition(p).x;
    let low = Infinity;
    for (const f of bones.feet) low = Math.min(low, f!.getWorldPosition(p).y);
    if (low < Infinity) scene.position.y -= low - 0.02;
  });

  return <primitive object={scene} />;
};

/**
 * Frames his full standing height (the push clip goes from a crouch to upright),
 * feet on the bottom edge and hands at the right edge.
 */
const Framing = () => {
  const camera = useThree((st) => st.camera) as OrthographicCamera;
  const size = useThree((st) => st.size);
  useLayoutEffect(() => {
    if (!size.height) return;
    camera.zoom = size.height / VIEW_HEIGHT;
    camera.position.set(-(size.width / camera.zoom) / 2 + HANDS_REACH, VIEW_HEIGHT / 2 - 0.02, 6);
    camera.rotation.set(0, 0, 0); // undo R3F's initial lookAt(0,0,0): look straight down -z
    camera.updateProjectionMatrix();
  }, [camera, size]);
  return null;
};

const CAMERA = { position: [0, 1, 6] as [number, number, number], near: 0.1, far: 50 };

/**
 * Transparent canvas: just the man, lit warm from the front, for the intro overlay.
 * Memoised because the intro re-renders every frame for its counter, and a fresh
 * `camera` prop would reset the framing.
 */
const IntroScene = memo(() => {
  useEffect(() => () => useGLTF.clear(PUSHER_URL), []);
  return (
    <Canvas
      orthographic
      dpr={[1, 1.75]}
      camera={CAMERA}
      gl={{ alpha: true, antialias: true }}
    >
      <Framing />
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 5]} intensity={2.4} color={palette.bone} />
      <directionalLight position={[-4, 2, -3]} intensity={3} color={palette.ember} />
      <hemisphereLight args={[palette.bone, '#1a1310', 0.6]} />
      <Suspense fallback={null}>
        <Pusher />
      </Suspense>
    </Canvas>
  );
});
IntroScene.displayName = 'IntroScene';

export default IntroScene;
