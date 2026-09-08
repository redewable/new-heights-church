/**
 * YouTube Data API env. Both the API key and channel ID are required for
 * livestream detection. Ingest-from-URL does not need the channel ID —
 * only the API key — because the video id is already in hand.
 */

export interface YouTubeEnv {
  apiKey: string;
  channelId: string;
}

export function getYouTubeEnv(): YouTubeEnv | null {
  const apiKey = process.env.YOUTUBE_API_KEY?.trim();
  const channelId = process.env.YOUTUBE_CHANNEL_ID?.trim();
  if (!apiKey || !channelId) return null;
  return { apiKey, channelId };
}

export function getYouTubeApiKey(): string | null {
  const apiKey = process.env.YOUTUBE_API_KEY?.trim();
  return apiKey && apiKey.length > 0 ? apiKey : null;
}
