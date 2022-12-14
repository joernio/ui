import { resolve } from 'path';
import { readFileSync } from 'fs';
import { store } from '../../store/configureStore';
import { setFindings } from '../../store/actions/findingsActions';
import { convert_file } from '../../assets/js/utils/joern2sarifconverter';
import {
	unrestrictedSaveFile,
	deepClone,
	handleSetToast,
} from '../../assets/js/utils/scripts';

export const getTriageIdArrIndex = (triage_id_arr_index, default_index) =>
	triage_id_arr_index === null ? default_index - 1 : triage_id_arr_index;

export const exportValidResults = triage_id_arr_index => {
	const { triage_ids, triages } = store.getState().findings;
	const arr =
		triage_ids[getTriageIdArrIndex(triage_id_arr_index, triage_ids.length)];
	const valid_findings = [];
	arr.forEach(id => {
		if (triages[id].valid) {
			valid_findings.push(triages[id].finding);
		}
	});
	const findings_sarif = convert_file(
		'ocular',
		'',
		resolve('./'),
		valid_findings
	);
	unrestrictedSaveFile('untitled', JSON.stringify(findings_sarif));
};

export const rotateTriageIdArrIndexRight = (
	triage_id_arr_index,
	triage_ids_length,
) => {
	triage_id_arr_index = getTriageIdArrIndex(
		triage_id_arr_index,
		triage_ids_length,
	);
	triage_id_arr_index += 1;
	triage_id_arr_index =
		triage_id_arr_index === triage_ids_length ? 0 : triage_id_arr_index;
	return { triage_id_arr_index };
};

export const rotateTriageIdArrIndexLeft = (
	triage_id_arr_index,
	triage_ids_length,
) => {
	triage_id_arr_index = getTriageIdArrIndex(
		triage_id_arr_index,
		triage_ids_length,
	);
	triage_id_arr_index -= 1;
	triage_id_arr_index =
		triage_id_arr_index < 0 ? triage_ids_length - 1 : triage_id_arr_index;
	return { triage_id_arr_index };
};

export const getFindingsSarifFromTriages = triage_id_arr_index => {
	const { triages, triage_ids } = store.getState().findings;
	let findings = triage_ids[
		getTriageIdArrIndex(triage_id_arr_index, triage_ids.length)
	]?.map(id => triages[id].finding);
	findings = findings && deepClone(findings);
	return (
		findings &&
		convert_file('ocular', '', resolve('./'), findings)
	);
};

export const getFindingsSarifFromLocalPath = () => {
	let findings_sarif_from_path = null;
	const { open_sarif_finding_path } = store.getState().findings;

	if (open_sarif_finding_path) {
		try {
			findings_sarif_from_path = JSON.parse(
				readFileSync(open_sarif_finding_path, 'utf8'),
			);
		} catch (e) {
			handleSetToast({
				icon: 'warning-sign',
				intent: 'danger',
				message: String(e),
			});

			store.dispatch(setFindings({ open_sarif_finding_path: '' }));
		}
	}

	return findings_sarif_from_path;
};

export const removeValidityButtonsFromFindingsElement = el => {
	const prevValidityButtons =
		el?.querySelectorAll('.result-validity-button') || [];
	prevValidityButtons?.forEach(button => {
		button.parentElement.removeChild(button);
	});
};

export const addValidityButtonsToFindingsElement = (
	el,
	findings_sarif,
	findings_sarif_from_path,
	triage_id_arr_index,
) => {
	if (findings_sarif && !findings_sarif_from_path) {
		const { triages, triage_ids } = store.getState().findings;

		const rows =
			el
				?.querySelector('table.swcTree')
				?.querySelectorAll(
					'tr.bolt-tree-row.bolt-table-row.bolt-list-row[aria-level="1"][aria-expanded]',
				) || [];

		rows.forEach(row => {
			const div = row.querySelector('div.bolt-table-cell-content');
			if (div && div.children.length === 2) {
				div.children[1].style['flex-grow'] = 1;
				const id = div.querySelector(
					'.swcRowRule .bolt-link',
				).textContent;
				let checked = true;
				triage_ids[
					getTriageIdArrIndex(triage_id_arr_index, triage_ids.length)
				]?.forEach(triage_id => {
					if (triage_id.startsWith(id)) {
						checked &&= triages[triage_id].valid;
					}
				});

				const checked_attr_str = `checked="${checked}"`;
				div.appendChild(
					// eslint-disable-next-line no-undef
					new DOMParser().parseFromString(
						`
            <label class="bp3-control bp3-switch result-validity-button">
            <input type="checkbox" ${checked && checked_attr_str}/>
            <span class="bp3-control-indicator">
            <div class="bp3-control-indicator-child">
            <div class="bp3-switch-inner-text">valid</div>
            </div>
            <div class="bp3-control-indicator-child">
            <div class="bp3-switch-inner-text">invalid</div>
            </div>
            </span>
            </label>
            `,
						'text/html',
					).body.firstChild,
				);
			}
		});

		const validityButtons =
			el?.querySelectorAll('.result-validity-button') || [];

		validityButtons.forEach(button => {
			button.addEventListener('click', function (e) {
				e.preventDefault();
				const input = this.querySelector('input');

				const checked =
					input.getAttribute('checked') === 'true' ? false : true;
				const id = this.parentElement.querySelector(
					'.swcRowRule .bolt-link',
				).innerText;
				const triages_clone = deepClone(triages);
				triage_ids[
					getTriageIdArrIndex(triage_id_arr_index, triage_ids.length)
				]?.forEach(triage_id => {
					if (triage_id.startsWith(id)) {
						triages_clone[triage_id].valid = checked;
					}
				});
				store.dispatch(setFindings({ triages: triages_clone }));
			});
		});
	}
};
