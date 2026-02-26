"""Fetches agency name metadata from the MobilityDatabase REST API."""

import logging
import os

import requests

logger = logging.getLogger(__name__)

_REFRESH_TOKEN = os.environ.get("MOBILITY_DB_API_KEY", "")
_BASE_URL = "https://api.mobilitydatabase.org/v1"
_PAGE_LIMIT = 100


def _get_access_token() -> str:
    """Exchange the refresh token for a short-lived access token."""
    resp = requests.post(
        f"{_BASE_URL}/tokens",
        json={"refresh_token": _REFRESH_TOKEN},
        timeout=30,
    )
    resp.raise_for_status()
    return resp.json()["access_token"]


def get_agency_names() -> dict:
    """Fetch GTFS-RT feed metadata from MobilityDatabase and return a
    mapping of {feed_id: agency_name}.

    Requires the MOBILITY_DB_API_KEY environment variable (refresh token).
    Returns an empty dict if the key is missing or any request fails.
    """
    if not _REFRESH_TOKEN:
        logger.warning("MOBILITY_DB_API_KEY not set; skipping agency name fetch")
        return {}

    try:
        access_token = _get_access_token()
    except requests.RequestException as exc:
        logger.error("MobilityDatabase token exchange failed: %s", exc)
        return {}

    headers = {"Authorization": f"Bearer {access_token}"}
    result = {}
    offset = 0

    while True:
        try:
            resp = requests.get(
                f"{_BASE_URL}/gtfs_rt_feeds",
                headers=headers,
                params={"offset": offset, "limit": _PAGE_LIMIT},
                timeout=30,
            )
            resp.raise_for_status()
        except requests.RequestException as exc:
            logger.error("MobilityDatabase request failed: %s", exc)
            break

        feeds = resp.json()
        for feed in feeds:
            # MobilityDatabase uses integer IDs (e.g. 1234); adjust this
            # if your feed_id format differs (e.g. "mdb-1234").
            feed_id = str(feed.get("id", ""))
            agency = feed.get("provider", "")
            if feed_id and agency:
                result[feed_id] = agency

        if len(feeds) < _PAGE_LIMIT:
            break
        offset += _PAGE_LIMIT

    logger.info("Fetched agency names for %d feeds", len(result))
    return result
