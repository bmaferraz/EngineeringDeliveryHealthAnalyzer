from __future__ import annotations

PROJECT_NAME_TO_ID: dict[str, str] = {
    "TSA-SITE": "TSITE",
    "RCEM 3.0": "RCEM3",
    "Voice Policy Engine 2.0": "VPE2",
    "AIP Risk Support": "AIPRS",
    "Steering 9.0": "NTR9",
}

PROJECT_ID_TO_NAME: dict[str, str] = {v: k for k, v in PROJECT_NAME_TO_ID.items()}


def get_project_id(name: str) -> str | None:
    """Return the project ID for a given project/space name, or None if unknown."""
    return PROJECT_NAME_TO_ID.get(name)


def get_project_name(project_id: str) -> str | None:
    """Return the project/space name for a given project ID, or None if unknown."""
    return PROJECT_ID_TO_NAME.get(project_id)
