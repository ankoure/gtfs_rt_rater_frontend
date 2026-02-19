import os

import boto3
from botocore.exceptions import ClientError, NoCredentialsError

# S3 bucket where aggregate JSON files are stored
S3_BUCKET = os.environ.get("GTFS_RT_RATER_BUCKET", "")


def _check_aws_credentials():
    """Check if valid AWS credentials are available."""
    try:
        sts = boto3.client("sts")
        sts.get_caller_identity()
        return True
    except (NoCredentialsError, ClientError):
        return False


def get_backend_source():
    """
    Determine the backend data source.
    Returns: 'aws' or 'static'
    """
    source = os.environ.get("BACKEND_SOURCE", "").lower()
    if source in ("aws", "static"):
        return source
    # Auto-detect: use AWS if credentials available AND bucket is configured
    return "aws" if (S3_BUCKET and _check_aws_credentials()) else "static"


# Cache the result at module load time for consistency
BACKEND_SOURCE = get_backend_source()
