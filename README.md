# OJAS Display

The site loads its exercise library and APK link through the Netlify Function
at `/api/content`.

Configure these environment variables in Netlify:

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`

The function also accepts the previous `VITE_SUPABASE_URL` and
`VITE_SUPABASE_PUBLISHABLE_KEY` names so existing deploy configuration keeps
working while the variables are renamed.

## 3D assets

The hero and intro use realistic Mixamo characters with real Mixamo mocap,
taken from the snapshot at
[Linzhan/Mixamo-Animations-Characters](https://huggingface.co/datasets/Linzhan/Mixamo-Animations-Characters)
and used under Adobe's Mixamo terms.

- `public/models/athlete.glb`: Jody with Air Squat, Jumping Rope, Bicep Curl,
  Kettlebell Swing, Push Up, Jumping Jacks and Warming Up.
- `public/models/pusher.glb`: Adam with Pushing (the intro).

Rebuild a model with Blender (textures are downsized to 1024 px WebP):

```bash
blender -b --python scripts/build-athlete.py -- Adam.glb public/models/pusher.glb push=Pushing.fbx
```
