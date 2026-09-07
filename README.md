# OJAS Display

The site loads its exercise library and APK link through the Netlify Function
at `/api/content`.

Configure these environment variables in Netlify:

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`

The function also accepts the previous `VITE_SUPABASE_URL` and
`VITE_SUPABASE_PUBLISHABLE_KEY` names so existing deploy configuration keeps
working while the variables are renamed.
