type ExerciseRow = {
  id: string;
  name: string;
  description: string;
  display_order: number;
  muscle_groups: string;
  image_url: string;
};

type ApkRow = {
  link: string;
};

const getEnvironmentVariable = (...names: string[]) => {
  for (const name of names) {
    const value = Netlify.env.get(name);
    if (value) return value;
  }

  return undefined;
};

const fetchTable = async <Row>(
  baseUrl: string,
  publishableKey: string,
  path: string,
) => {
  const response = await fetch(`${baseUrl}/rest/v1/${path}`, {
    headers: {
      apikey: publishableKey,
      Authorization: `Bearer ${publishableKey}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Supabase request failed with status ${response.status}`);
  }

  return (await response.json()) as Row[];
};

export default async (request: Request) => {
  if (request.method !== 'GET') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const supabaseUrl = getEnvironmentVariable(
    'SUPABASE_URL',
    'VITE_SUPABASE_URL',
  );
  const supabasePublishableKey = getEnvironmentVariable(
    'SUPABASE_PUBLISHABLE_KEY',
    'SUPABASE_ANON_KEY',
    'VITE_SUPABASE_PUBLISHABLE_KEY',
  );

  if (!supabaseUrl || !supabasePublishableKey) {
    return Response.json(
      { error: 'Backend environment variables are not configured' },
      { status: 503 },
    );
  }

  try {
    const [exercises, apkRows] = await Promise.all([
      fetchTable<ExerciseRow>(
        supabaseUrl,
        supabasePublishableKey,
        'exercises?select=id,name,description,display_order,muscle_groups,image_url&is_active=eq.true&order=display_order.asc',
      ),
      fetchTable<ApkRow>(
        supabaseUrl,
        supabasePublishableKey,
        'APK?select=link&limit=1',
      ),
    ]);

    return Response.json(
      { exercises, apkLink: apkRows[0]?.link ?? null },
      { headers: { 'Cache-Control': 'public, max-age=60, s-maxage=300' } },
    );
  } catch {
    return Response.json(
      { error: 'Backend content could not be loaded' },
      { status: 502 },
    );
  }
};

export const config = {
  path: '/api/content',
};
