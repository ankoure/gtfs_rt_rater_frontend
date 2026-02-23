export interface FeedSummary {
  feed_id: string;
  agency_name?: string;
  overall_grade: string;
  overall_score: number;
  uptime_percent: number;
}

export interface FeedsList {
  generated_at: string;
  feeds: FeedSummary[];
}

export interface FieldMetric {
  avg_support: number;
  stddev: number;
  grade: string;
}

export interface FeedDetail {
  schema_version: number;
  algorithm_version: number;
  feed_id: string;
  agency_name?: string;
  last_updated: string;
  window_minutes: number;
  entity_stats: {
    avg_vehicles: number;
    uptime_percent: number;
  };
  fields: Record<string, FieldMetric>;
  overall: {
    score: number;
    grade: string;
  };
}
