"""Chalice application defining the GTFS-RT Rater REST API endpoints."""

import json
import os

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass  # not installed in Lambda; env vars come from Lambda configuration

from chalice import CORSConfig, NotFoundError, Rate, Response, UnauthorizedError
from chalice_spec import ChaliceWithSpec, PydanticPlugin, Docs
from apispec import APISpec

from chalicelib import config, mobility_database, models, s3, static_data


spec = APISpec(
    title="GTFS-RT Rater API",
    version="1.0.0",
    openapi_version="3.0.0",
    plugins=[PydanticPlugin()],
)
app = ChaliceWithSpec(app_name="gtfs-rt-rater", spec=spec, generate_default_docs=True)

localhost = "localhost:3000"
FRONTEND_HOST = os.environ.get("FRONTEND_HOST", localhost)
ADMIN_TOKEN = os.environ.get("ADMIN_TOKEN", "")

cors_config = CORSConfig(allow_origin=f"https://{FRONTEND_HOST}", max_age=3600)


@app.schedule(Rate(24, unit=Rate.HOURS))
def refresh_agency_names(event):
    """Daily task: fetch agency names from MobilityDatabase and cache in S3."""
    names = mobility_database.get_agency_names()
    if names:
        s3.put_agency_names(names)


@app.route("/api/admin/refresh-agency-names", methods=["POST"], docs=Docs(response=models.AgencyRefreshResponse))
def trigger_refresh_agency_names():
    """Manually trigger an agency name refresh from MobilityDatabase."""
    token = app.current_request.headers.get("x-admin-token", "")
    if not ADMIN_TOKEN or token != ADMIN_TOKEN:
        raise UnauthorizedError("Invalid or missing admin token")

    names = mobility_database.get_agency_names()
    if names:
        s3.put_agency_names(names)

    return Response(
        body=json.dumps({"updated": len(names)}),
        headers={"Content-Type": "application/json"},
        status_code=200,
    )


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
