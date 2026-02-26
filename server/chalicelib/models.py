from typing import Dict, List, Optional
from pydantic import BaseModel


class HealthcheckResponse(BaseModel):
    status: str


class AgencyRefreshResponse(BaseModel):
    updated: int


class FeedSummary(BaseModel):
    feed_id: str
    agency_name: Optional[str] = None
    overall_grade: str
    overall_score: float
    uptime_percent: float


class FeedsListResponse(BaseModel):
    generated_at: str
    feeds: List[FeedSummary]


class FieldMetric(BaseModel):
    avg_support: float
    stddev: float
    grade: str


class EntityStats(BaseModel):
    avg_vehicles: float
    uptime_percent: float


class OverallScore(BaseModel):
    score: float
    grade: str


class FeedDetailResponse(BaseModel):
    schema_version: int
    algorithm_version: int
    feed_id: str
    agency_name: Optional[str] = None
    last_updated: str
    window_minutes: int
    entity_stats: EntityStats
    fields: Dict[str, FieldMetric]
    overall: OverallScore
