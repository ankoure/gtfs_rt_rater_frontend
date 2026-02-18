"""S3 helpers for reading aggregate JSON files produced by the rater."""

import json

import boto3
from botocore.exceptions import ClientError

from chalicelib import config


def _get_object(key: str):
    client = boto3.client("s3")
    try:
        response = client.get_object(Bucket=config.S3_BUCKET, Key=key)
        return json.loads(response["Body"].read())
    except ClientError as e:
        if e.response["Error"]["Code"] == "NoSuchKey":
            return None
        raise


def get_feeds():
    """Return the feeds list aggregate from S3."""
    return _get_object("aggregates/feeds.json")


def get_feed_detail(feed_id: str):
    """Return the per-feed detail aggregate from S3, or None if not found."""
    return _get_object(f"aggregates/feeds/{feed_id}.json")
