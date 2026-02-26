"""S3 helpers for reading aggregate JSON files produced by the rater."""

import json
import time

import boto3
from botocore.exceptions import ClientError

from chalicelib import config

_AGENCY_NAMES_KEY = "aggregates/agency_names.json"

# Module-level cache so Lambda warm invocations skip the extra S3 fetch.
_agency_cache: dict = {}
_agency_cache_loaded_at: float = 0.0
_AGENCY_CACHE_TTL = 3600  # 1 hour


def _get_object(key: str):
    client = boto3.client("s3")
    try:
        response = client.get_object(Bucket=config.S3_BUCKET, Key=key)
        return json.loads(response["Body"].read())
    except ClientError as e:
        if e.response["Error"]["Code"] == "NoSuchKey":
            return None
        raise


def _put_object(key: str, data) -> None:
    client = boto3.client("s3")
    client.put_object(
        Bucket=config.S3_BUCKET,
        Key=key,
        Body=json.dumps(data),
        ContentType="application/json",
    )


def _get_agency_names() -> dict:
    global _agency_cache, _agency_cache_loaded_at
    if time.time() - _agency_cache_loaded_at < _AGENCY_CACHE_TTL:
        return _agency_cache
    data = _get_object(_AGENCY_NAMES_KEY)
    _agency_cache = data or {}
    _agency_cache_loaded_at = time.time()
    return _agency_cache


def put_agency_names(names: dict) -> None:
    """Write the agency names mapping to S3 and invalidate the local cache."""
    global _agency_cache, _agency_cache_loaded_at
    _put_object(_AGENCY_NAMES_KEY, names)
    _agency_cache = names
    _agency_cache_loaded_at = time.time()


def get_feeds():
    """Return the feeds list aggregate from S3, enriched with agency names."""
    data = _get_object("aggregates/feeds.json")
    if data is None:
        return None
    agency_names = _get_agency_names()
    for feed in data.get("feeds", []):
        feed_id = feed.get("feed_id", "")
        if feed_id in agency_names:
            feed["agency_name"] = agency_names[feed_id]
    return data


def get_feed_detail(feed_id: str):
    """Return the per-feed detail aggregate from S3, or None if not found."""
    data = _get_object(f"aggregates/feeds/{feed_id}.json")
    if data is None:
        return None
    agency_names = _get_agency_names()
    if feed_id in agency_names:
        data["agency_name"] = agency_names[feed_id]
    return data
