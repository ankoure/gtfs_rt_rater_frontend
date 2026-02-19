import type { FeedDetail, FeedsList } from "../types/feeds";

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:5000";

export async function getFeeds(): Promise<FeedsList> {
  const res = await fetch(`${API_BASE_URL}/api/feeds`, {
    next: { revalidate: 900 },
  });
  if (!res.ok) throw new Error(`Failed to fetch feeds: ${res.status}`);
  return res.json();
}

export async function getFeedDetail(feedId: string): Promise<FeedDetail> {
  const res = await fetch(`${API_BASE_URL}/api/feeds/${feedId}`, {
    next: { revalidate: 900 },
  });
  if (!res.ok) throw new Error(`Failed to fetch feed ${feedId}: ${res.status}`);
  return res.json();
}
