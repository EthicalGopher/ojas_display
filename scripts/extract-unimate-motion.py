"""Extract per-frame joint positions from a UniMate-animated GLB for the hero's balance hold.

Usage: blender -b --python scripts/extract-unimate-motion.py -- <unimate_animated.glb> public/models/balance.json
"""
import bpy, json, sys
src = sys.argv[sys.argv.index('--') + 1]
out = sys.argv[sys.argv.index('--') + 2]
BONES = ['Hips','Head','HeadTop_End','RightArm','LeftArm','RightForeArm','LeftForeArm','RightHand','LeftHand',
         'RightHandPinky1','LeftHandPinky1','RightHandIndex1','LeftHandIndex1','RightHandThumb2','LeftHandThumb2',
         'RightUpLeg','LeftUpLeg','RightLeg','LeftLeg','RightFoot','LeftFoot','RightToe_End','LeftToe_End']
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=src)
arm = [o for o in bpy.data.objects if o.type == 'ARMATURE'][0]
names = {b.name.split(':')[-1].replace('mixamorig', ''): b.name for b in arm.pose.bones}
act = arm.animation_data.action
f0, f1 = map(int, act.frame_range)
scene = bpy.context.scene
frames = []
for f in range(f0, f1 + 1):
    scene.frame_set(f)
    row = {}
    for b in BONES:
        pb = arm.pose.bones.get(names.get(b, ''))
        if pb is None: continue
        p = arm.matrix_world @ pb.head
        row[b] = [p.x, p.y, p.z]  # this export is already Y-up in Blender space
    frames.append(row)
# normalise: feet on the floor, hips centred, 1.7 tall at the first frame
first = frames[0]
height = first['HeadTop_End'][1] - min(first['LeftToe_End'][1], first['RightToe_End'][1]) if 'HeadTop_End' in first else 1
k = 1.62 / height
floor = min(min(r['LeftToe_End'][1], r['RightToe_End'][1]) for r in frames)
cx, cz = first['Hips'][0], first['Hips'][2]
for r in frames:
    for b, (x, y, z) in r.items():
        r[b] = [round((x - cx) * k, 4), round((y - floor) * k, 4), round((z - cz) * k, 4)]
json.dump({'fps': scene.render.fps, 'source': 'UniMate: "An object does a yoga pose, balancing on one leg."', 'frames': frames}, open(out, 'w'))
print('FRAMES', len(frames), 'fps', scene.render.fps, 'bones', len(frames[0]), 'missing', [b for b in BONES if b not in frames[0]])
