import type { FeedDetail, FeedsList } from "../types/feeds";

import feedsData from "../../examples/aggregates/feeds.json";
import feedDetailData from "../../examples/aggregates/feeds/mdb-2335.json";

export function getFeeds(): FeedsList {
  return feedsData as FeedsList;
}

export function getFeedDetail(_feedId: string): FeedDetail {
  return feedDetailData as FeedDetail;
}
