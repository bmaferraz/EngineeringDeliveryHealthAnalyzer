/** Maps space display names to JIRA project IDs. */
export const SPACE_TO_PROJECT_ID: Record<string, string> = {
  'TSA-SITE': 'TSITE',
  'RCEM 3.0': 'RCEM3',
  'Voice Policy Engine 2.0': 'VPE2',
  'AIP Risk Support': 'AIPRS',
  'Steering 9.0': 'NTR9',
}

/** Convert a space display name to its JIRA project ID. Returns undefined if unknown. */
export function spaceToProjectId(space: string): string | undefined {
  return SPACE_TO_PROJECT_ID[space]
}


