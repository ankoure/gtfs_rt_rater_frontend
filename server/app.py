"""Chalice application defining the GTFS-RT Rater REST API endpoints."""

import json
import os

from chalice import CORSConfig, NotFoundError, Response
from chalice_spec import ChaliceWithSpec, PydanticPlugin, Docs
from apispec import APISpec

from chalicelib import config, models, s3, static_data


spec = APISpec(
    title="GTFS-RT Rater API",
    version="1.0.0",
    openapi_version="3.0.0",
    plugins=[PydanticPlugin()],
)
app = ChaliceWithSpec(app_name="gtfs-rt-rater", spec=spec, generate_default_docs=True)

localhost = "localhost:3000"
FRONTEND_HOST = os.environ.get("FRONTEND_HOST", localhost)

cors_config = CORSConfig(allow_origin=f"https://{FRONTEND_HOST}", max_age=3600)


@app.route("/api/healthcheck", cors=cors_config, docs=Docs(response=models.HealthcheckResponse))
def healthcheck():
    """Check that the API is reachable."""
    return Response(body={"status": "pass"}, status_code=200)


@app.route("/api/feeds", cors=cors_config, docs=Docs(response=models.FeedsListResponse))
def get_feeds():
    """Return all monitored GTFS-RT feeds with their overall grades and uptime."""
    if config.BACKEND_SOURCE == "static":
        data = static_data.get_feeds()
    else:
        data = s3.get_feeds()

    return Response(
        body=json.dumps(data),
        headers={"Content-Type": "application/json", "Cache-Control": "public, max-age=900"},
    )


@app.route("/api/feeds/{feed_id}", cors=cors_config, docs=Docs(response=models.FeedDetailResponse))
def get_feed_detail(feed_id):
    """Return detailed field-level quality metrics for a specific GTFS-RT feed."""
    if config.BACKEND_SOURCE == "static":
        data = static_data.get_feed_detail(feed_id)
    else:
        data = s3.get_feed_detail(feed_id)

    if data is None:
        raise NotFoundError(f"Feed '{feed_id}' not found")

    return Response(
        body=json.dumps(data),
        headers={"Content-Type": "application/json", "Cache-Control": "public, max-age=900"},
    )
