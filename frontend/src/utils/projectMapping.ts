/** Maps space display names to JIRA project IDs. */
export const SPACE_TO_PROJECT_ID: Record<string, string> = {
  'TSA-SITE': 'TSITE',
  'Voice Policy Engine 2.0': 'VPE2',
  'RCEM 3.0': 'RCEM3',
  'RCEM 3.2': 'RCEM32',
}

/** Convert a space display name to its JIRA project ID. Returns undefined if unknown. */
export function spaceToProjectId(space: string): string | undefined {
  return SPACE_TO_PROJECT_ID[space]
}

/** Per-project allowlisted contributor display names shown on the landing page.
 * Each person belongs to exactly one project — do not duplicate across projects. */
export const PROJECT_CONTRIBUTORS: Record<string, string[]> = {
  'TSA-SITE': ['Sukrutha Karthik'],
  'Voice Policy Engine 2.0': ['Roja Rameti'],
  'RCEM 3.0': ['Sumit Kumar'],
  'RCEM 3.2': ['Chandramouli B'],
}

/** Return the contributor allowlist for a given space as a Set (O(1) lookup). */
export function getAllowedContributors(space: string): Set<string> {
  return new Set(PROJECT_CONTRIBUTORS[space] ?? [])
}
