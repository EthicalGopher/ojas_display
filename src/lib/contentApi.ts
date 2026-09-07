export type ExerciseRow = {
  id: string;
  name: string;
  description: string;
  display_order: number;
  muscle_groups: string;
  image_url: string;
};

type ContentResponse = {
  exercises: ExerciseRow[];
  apkLink: string | null;
};

let contentRequest: Promise<ContentResponse> | null = null;

export const getContent = () => {
  if (!contentRequest) {
    contentRequest = fetch('/api/content').then(async (response) => {
      if (!response.ok) {
        throw new Error('Content request failed');
      }

      return (await response.json()) as ContentResponse;
    });
  }

  return contentRequest;
};
