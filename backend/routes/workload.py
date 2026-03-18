from fastapi import APIRouter, Query

from analytics.data_loader import load_issues
from analytics.workload import workload_distribution
from models.response import make_response

router = APIRouter(prefix="/api/v1", tags=["workload"])


@router.get("/workload")
def get_workload(
    project: str | None = Query(
        None,
        description="Filter by JIRA project ID, e.g. 'TSITE', 'VPE2', 'RCEM3', 'RCEM32'",
    ),
) -> dict:
    issues = load_issues()
    if project:
        issues = [i for i in issues if i.project == project]
    distribution = workload_distribution(issues)
    return make_response(distribution)
