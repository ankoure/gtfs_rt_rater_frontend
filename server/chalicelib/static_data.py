"""Reads local example JSON files for development without AWS credentials."""

import json
import os

EXAMPLES_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "examples", "aggregates")


def _read_json(path: str):
    try:
        with open(path) as f:
            return json.load(f)
    except FileNotFoundError:
        return None


def get_feeds():
    """Return the feeds list from the local examples directory."""
    return _read_json(os.path.join(EXAMPLES_DIR, "feeds.json"))


def get_feed_detail(feed_id: str):
    """Return a per-feed detail from the local examples directory, or None if not found."""
    return _read_json(os.path.join(EXAMPLES_DIR, "feeds", f"{feed_id}.json"))
