import { createSelector } from 'reselect';

export const selectFindings = state => state.findings;

export const selectTriages = createSelector(
	[selectFindings],
	findings => findings.triages,
);
export const selectTriageIds = createSelector(
	[selectFindings],
	findings => findings.triage_ids,
);
