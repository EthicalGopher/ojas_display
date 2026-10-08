"""Bake Mixamo mocap clips onto a Mixamo character and export a compact GLB for the site.

Sources: the Mixamo snapshot at huggingface.co/datasets/Linzhan/Mixamo-Animations-Characters
(character_refined_glb/<Name>.glb, animation_motion/<Clip>.fbx). Mixamo assets are used under
Adobe's Mixamo terms (royalty-free use in projects; no redistribution as standalone assets).

Usage (Blender 4+):
  blender -b --python scripts/build-athlete.py -- <character.glb> <out.glb> name=Clip.fbx [name=Clip.fbx ...]

  # hero athlete (Jody)
  blender -b --python scripts/build-athlete.py -- mx/Jody.glb public/models/athlete.glb \
      squat=mx/Air_Squat.fbx skip=mx/Jumping_Rope.fbx curl=mx/Bicep_Curl.fbx swing=mx/Kettlebell_Swing.fbx \
      pushup=mx/Push_Up.fbx jacks=mx/Jumping_Jacks.fbx warmup=mx/Warming_Up.fbx
  # intro pusher (Adam)
  blender -b --python scripts/build-athlete.py -- mx/Adam.glb public/models/pusher.glb push=mx/Pushing.fbx
"""
import sys

import bpy

args = sys.argv[sys.argv.index('--') + 1:]
src, out, clips = args[0], args[1], dict(a.split('=', 1) for a in args[2:])

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=src)
# stray helper meshes some refined exports carry (an "Icosphere", loose or under the armature)
for o in list(bpy.data.objects):
    if o.type == 'MESH' and (o.parent is None or o.name.startswith('Icosphere')):
        bpy.data.objects.remove(o)
arm = [o for o in bpy.data.objects if o.type == 'ARMATURE'][0]
arm.animation_data_create()

for name, fbx in clips.items():
    before = set(bpy.data.objects)
    bpy.ops.import_scene.fbx(filepath=fbx)
    new = [o for o in bpy.data.objects if o not in before]
    act = [o for o in new if o.type == 'ARMATURE'][0].animation_data.action
    act.name = name
    act.use_fake_user = True
    track = arm.animation_data.nla_tracks.new()
    track.name = name
    track.strips.new(name, int(act.frame_range[0]), act)
    track.mute = True
    for o in new:
        bpy.data.objects.remove(o)
    print('CLIP', name, act.frame_range[:])

# 4K textures are far more than a web hero needs
for im in bpy.data.images:
    if im.size[0] > 1024:
        side = 512 if 'Gloss' in im.name or 'Specular' in im.name else 1024
        im.scale(side, side)
    print('IMG', im.name, im.size[:])

arm.animation_data.action = None
bpy.ops.export_scene.gltf(
    filepath=out, export_format='GLB', export_image_format='WEBP', export_image_quality=80,
    export_animation_mode='NLA_TRACKS', export_anim_single_armature=True, export_force_sampling=True,
    export_optimize_animation_size=True, export_def_bones=False, export_yup=True,
)
