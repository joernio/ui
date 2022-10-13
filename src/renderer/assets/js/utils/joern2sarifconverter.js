import path from 'path';
import { readFileSync } from 'fs';
import { v4 as uuid_v4 } from 'uuid';

const repo_url_prefixes = ['http', 'git', 'ssh'];

const default_driver_name = 'Joern';

const tool_drivers = {
	joern: 'Joern',
	ocular: 'ShiftLeft Ocular',
	'ng-sast': 'ShiftLeft NextGen Analysis',
	ngsast: 'ShiftLeft NextGen Analysis',
	core: 'ShiftLeft CORE Analysis',
};

// const hosted_viewer_uri = "https://sarifviewer.azurewebsites.net";

export const parse_code = code => {
	/* Method to parse the code to extract line number and snippets */

	const code_lines = code.split('\n');
	let last_line = code_lines[code_lines.length - 1];
	let last_real_line_ends_in_newline = false;

	if (last_line.length === 0) {
		code_lines.pop();
		last_real_line_ends_in_newline = true;
	}

	const snippet_lines = [];
	let first = true;
	let first_line_number = 1;

	code_lines.forEach(code_line => {
		const number_and_snippet_line = code_line.split(' ', 1);

		if (first) {
			first_line_number = Number(number_and_snippet_line[0]);
			first = false;
		}

		if (number_and_snippet_line.length > 1) {
			const snippet_line = `${number_and_snippet_line[1]}\n`;
			snippet_lines.push(snippet_line);
		}
	});

	if (!last_real_line_ends_in_newline) {
		last_line = snippet_lines[snippet_lines.length - 1];
		snippet_lines[snippet_lines.length - 1] = last_line.slice(
			0,
			last_line.length - 1,
		);
	}

	return [first_line_number, snippet_lines];
};

export const get_rule_short_description = (
	tool_name,
	rule_id,
	issue_obj,
) => {
	/*
  Constructs a short description for the rule
   :param tool_name:
  :param rule_id:
  :param test_name:
  :param issue_obj:
  :return:
  */
	if (issue_obj.short_description) {
		return issue_obj.short_description;
	}

	return `Rule ${rule_id} from ${tool_name}.`;
};

export const get_rule_full_description = (
	issue_obj,
) => {
	/*
  Constructs a full description for the rule
   :param tool_name:
  :param rule_id:
  :param test_name:
  :param issue_obj:
  :return:
  */
	let issue_text = issue_obj.issue_text || '';

	if (issue_text) {
		issue_text = issue_text.split('\n')[0];
	}

	if (!issue_text.endsWith('.')) {
		issue_text += '.';
	}

	return issue_text;
};

export const get_help = (format, issue_obj) => {
	/*
  Constructs a full description for the rule
   :param format: text or markdown
  :param tool_name:
  :param rule_id:
  :param test_name:
  :param issue_obj:
  :return: Help text
  */
	let issue_text = issue_obj.issue_text || '';

	if (format === 'text') {
		issue_text = issue_text.replaceAll('`', '');
	}
	return issue_text;
};

export const get_url = (rule_id, issue_obj) => {
	if (issue_obj.test_ref_url) {
		return issue_obj.test_ref_url;
	}

	rule_id = encodeURIComponent(rule_id).replaceAll(/%20/g, '+');

	if (rule_id && rule_id.startsWith('CWE')) {
		return `https://cwe.mitre.org/data/definitions/${rule_id.replaceAll(
			'CWE-',
			'',
		)}.html`;
	}

	if (issue_obj.cwe_category) {
		return `https://cwe.mitre.org/data/definitions/${issue_obj.cwe_category.replaceAll(
			'CWE-',
			'',
		)}.html`;
	}

	return 'https://docs.shiftleft.io/ngsast/product-info/coverage#vulnerabilities';
};

export const level_from_severity = severity => {
	/* Converts tool's severity to the 4 level
  suggested by SARIF
  */
	if (severity === 'CRITICAL') {
		return 'error';
	} else if (severity === 'HIGH') {
		return 'error';
	} else if (severity === 'MEDIUM') {
		return 'warning';
	} else if (severity === 'LOW') {
		return 'note';
	} else {
		return 'warning';
	}
};

export const capwords = str => {
	/**
	 * Capitalize all words in a string
	 */
	const pattern = /^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g;
	return str.replaceAll(pattern, word => word.toUpperCase());
};

export const create_or_find_rule = (
	tool_name,
	issue_obj,
	rules,
	rule_indices,
) => {
	/* Creates rules object for the rules section. Different tools make up
  their own id and names so this is identified on the fly
    :param tool_name: tool name
  :param issue_obj: Issue object that is normalized and converted
  :param rules: List of rules identified so far
  :param rule_indices: Rule indices cache
    :return rule and index
  */
	const rule_id = issue_obj['test_id'];
	let rule_name = issue_obj['test_name'];
	if (rule_id === rule_name) {
		rule_name = rule_name.toLowerCase().replaceAll('_', ' ');
	}
	if (rule_id === rule_name.toLowerCase()) {
		rule_name = `${rule_name} rule`;
	}
	rule_name = capwords(rule_name).replaceAll(' ', '');
	if (rules[rule_id]) {
		return [rules[rule_id], rule_indices[rule_id]];
	}
	const precision = 'very-high';
	const issue_severity = issue_obj['issue_severity'];

	const rule = {
		id: rule_id,
		help: {
			text: get_help(
				'text',
				issue_obj,
			),
			markdown: get_help(
				'markdown',
				issue_obj,
			),
		},
		name: rule_name,
		properties: {
			tags: [tool_name],
			precision,
		},
		defaultConfiguration: {
			level: level_from_severity(issue_severity),
		},
		fullDescription: {
			text: get_rule_full_description(
				issue_obj,
			),
		},
		helpUri: get_url(rule_id, issue_obj),
		shortDescription: {
			text: get_rule_short_description(
				tool_name,
				rule_id,
				issue_obj,
			),
		},
	};
	const index = Object.keys(rules).length;
	rules[rule_id] = rule;
	rule_indices[rule_id] = index;
	return [rule, index];
};

export const to_uri = file_path => {
	/* Converts to file path to uri prefixed with file://
   :param file_path: File path to convert
  */
	let pure_path = file_path;
	let platform = 'posix';
	if (file_path.startsWith('http')) {
		return file_path;
	}
	if (file_path.includes('\\')) {
		if (file_path.includes('/')) {
			file_path = file_path.replaceAll('/', '\\');
		}
		pure_path = file_path;
		platform = 'win';
	}

	if (platform === 'posix') {
		if (path.posix.isAbsolute(pure_path)) {
			return `file://${pure_path}`;
		}
	} else if (path.win32.isAbsolute(pure_path)) {
		return `file:///${pure_path}`;
	}

	return pure_path.split(path.sep).join(path.posix.sep);
};

class Issue {
	constructor(
		severity = 'LOW',
		confidence = 'HIGH',
		text = '',
		ident = null,
		lineno = null,
		test_id = '',
	) {
		this.severity = severity;
		this.confidence = confidence;
		this.text = decodeURIComponent(text);
		this.short_description = '';
		this.cwe_category = '';
		this.owasp_category = '';
		this.code = '';
		this.ident = ident;
		this.fname = '';
		this.test = '';
		this.test_id = test_id;
		this.test_ref_url = null;
		this.lineno = lineno;
		this.linerange = [];
		this.snippet_based = false;
		this.line_hash = '';
		this.first_found = null;
		this.tags = {};
		this.codeflows = [];
	}

	toString() {
		return `Issue: '${this.text}' from ${this.test_id}:${
			this.ident || this.test
		}: Severity: ${this.severity} Confidence: ${this.confidence} at ${
			this.fname
		}:${Number(this.lineno)}`;
	}

	isEqual(other) {
		// if the issue text, severity, confidence, and filename match, it's
		// the same issue from our perspective

		return (
			this.text === other.text &&
			this.severity === other.severity &&
			this.confidence === other.confidence &&
			this.fname === other.fname &&
			this.test === other.test &&
			this.test_id === other.test_id &&
			this.line_hash === other.line_hash
		);
	}

	notEqual(other) {
		return !this.isEqual(other);
	}

	hash() {
		// not a real hash
		return this.toString();
	}

	// eslint-disable-next-line no-underscore-dangle
	_get_code_line(line) {
		const fname = this.fname;
		let text = '';
		try {
			const data = readFileSync(fname, 'utf8');
			text = data.split('\n')[line];
		} catch (err) {
			if (err.code !== 'ENOENT') {
				// eslint-disable-next-line no-console
				console.log(
					'an error occured reading file. attempting to read a binary',
				);
				const binary = readFileSync(fname, null);
				if (line < binary.length) {
					text = binary[line];
				}
			}
		}
		return text;
	}

	get_code(max_lines = 3, tabbed = false) {
		if (!this.fname) {
			return '';
		}
		const lines = [];
		max_lines = Math.max(max_lines, 1);

		const lmin = Math.max(1, this.lineno - Math.floor(max_lines / 2));
		const lmax = lmin + this.linerange.length + max_lines - 1;

		const range = [...Array(lmax - lmin + 1).keys()].map(x => x + lmin);

		// eslint-disable-next-line no-restricted-syntax
		for (const line of range) {
			let text = this._get_code_line(line); // eslint-disable-line no-underscore-dangle
			text = Buffer.from(text, 'utf-8').toString();
			if (!text.length) {
				break;
			}
			lines.push(`${line}${tabbed ? '\t' : ' '}${text}`);
		}
		if (lines.length > 0) {
			return lines.join('');
		} else if (this.code) {
			const orig_lines = this.code.split('\n');
			if (orig_lines.length > 0) {
				const orig_first_line = orig_lines[0];
				const firstword = orig_first_line.split(' ', 1)[0];
				if (firstword && !Number.isNaN(Number(firstword))) {
					return this.code;
				}
			}
			return '';
		} else {
			return '';
		}
	}

	as_dict(with_code = true) {
		let issue_text = Buffer.from(this.text, 'utf-8').toString();
		if (!issue_text.endsWith('.')) {
			issue_text += '.';
		}
		if (this.test) {
			if (this.test === 'blacklist') {
				this.test = 'blocklist';
			}
			if (this.test === 'whitelist') {
				this.test = 'allowlist';
			}
			if (this.test.includes('_')) {
				this.test = this.test.replaceAll('_', ' ');
				const tmpA = this.test.split(' ');
				if (tmpA.length < 3) {
					this.test = this.test.replaceAll(/(^\w|\s\w)/g, m =>
						m.toUpperCase(),
					);
				}
			}
		}
		if (!this.short_description && issue_text) {
			this.short_description = issue_text.split('. ')[0];
		}
		const out = {
			filename: this.fname,
			test_name: this.test,
			title: this.title,
			test_id: String(this.test_id),
			test_ref_url: this.test_ref_url,
			issue_severity: this.severity,
			issue_confidence: this.confidence,
			issue_text,
			line_number: this.lineno,
			line_range: this.linerange,
			first_found: this.first_found,
			short_description: this.short_description,
			cwe_category: this.cwe_category,
			owasp_category: this.owasp_category,
			tags: this.tags,
			line_hash: this.line_hash,
			codeflows: this.codeflows,
		};
		if (with_code) {
			out['code'] = this.get_code();
			if (this.lineno !== out['line_number']) {
				out['line_number'] = this.lineno;
			}
		}
		return out;
	}

	// eslint-disable-next-line class-methods-use-this
	norm_severity(severity) {
		severity = severity.toUpperCase();
		if (severity === 'ERROR' || severity === 'SEVERITY_HIGH_IMPACT') {
			return 'CRITICAL';
		}
		if (
			severity === 'WARN' ||
			severity === 'WARNING' ||
			severity === 'SEVERITY_MEDIUM_IMPACT'
		) {
			return 'MEDIUM';
		}
		if (severity === 'INFO' || severity === 'SEVERITY_LOW_IMPACT') {
			return 'LOW';
		}
		return severity;
	}

	find_severity(data) {
		let severity = 'LOW';
		if (data['confidence']) {
			severity = data['confidence'].toUpperCase();
		}
		if (data['issue_severity'] || data['priority']) {
			let sev = data['issue_severity'] || data['priority'];
			severity = sev;
			if (!Number.isNaN(Number(sev))) {
				sev = Number(sev);
				if (sev <= 3) {
					severity = 'LOW';
				} else if (sev <= 5) {
					severity = 'MEDIUM';
				} else if (sev <= 8) {
					severity = 'HIGH';
				} else if (sev > 8) {
					severity = 'CRITICAL';
				}
			}
		}
		if (data['severity']) {
			severity = String(data['severity']).toUpperCase();
		}
		if (data['commit']) {
			severity = 'HIGH';
		}
		return this.norm_severity(severity);
	}

	get_lineno(data) {
		let lineno = 1;
		let tmp_no = 1;
		if (data['line_number']) {
			tmp_no = data['line_number'];
		}
		if (!Number.isNaN(Number(tmp_no))) {
			lineno = Number(tmp_no);
		}
		return lineno;
	}

	get_test_id(data) {
		let test_id = '';
		if (data['test_id']) {
			test_id = data['test_id'];
		}
		if (data['rule_id']) {
			test_id = data['rule_id'];
		}
		return test_id;
	}

	from_dict(data) {
		if (data['filename']) {
			this.fname = data['filename'];
		}
		this.severity = this.find_severity(data);
		if (data['issue_confidence']) {
			this.confidence = data['issue_confidence'].toUpperCase();
		}
		if (data['confidence']) {
			this.confidence = data['confidence'].toUpperCase();
		}
		if (data['issue_text']) {
			this.text = data['issue_text'];
		}
		if (data['description']) {
			this.text = data['description'];
		}
		if (data['short_description']) {
			this.short_description = data['short_description'];
		}
		if (data['cwe_category']) {
			this.cwe_category = data['cwe_category'];
		}
		if (data['owasp_category']) {
			this.owasp_category = data['owasp_category'];
		}
		if (data['title']) {
			this.test = data['title'].split(':')[0];
			this.title = data['title'];
		}
		this.test_id = this.get_test_id(data);
		if (data['link']) {
			this.test_ref_url = data['link'];
		}
		if (data['more_info']) {
			this.test_ref_url = data['more_info'];
		}
		this.lineno = this.get_lineno(data);
		if (data['first_found']) {
			this.first_found = data['first_found'];
		}
		if (data['tags'] && data['tags']?.constructor === Object) {
			this.tags = data['tags'];
		}
		if (data['fingerprint']) {
			this.line_hash = data['fingerprint'];
		}
		if (data['codeflows']) {
			this.codeflows = data['codeflows'];
		}
	}
}

export const issue_from_dict = data => {
	const i = new Issue();
	i.from_dict(data);
	return i;
};

export const sanitize_url = url => {
	/*
  Method to sanitize url to remove credentials and tokens

  * param url: URL to sanitize
  * return: sanitized url
  */
	const result = new URL(url);
	const username = result.username;
	const password = result.password;
	let sens_str = '';

	if (username && password) {
		sens_str = `${username}:${password}@`;
	}

	url = url.replaceAll(sens_str, '');

	if (password) {
		url = url.replaceAll(password, '');
	}

	return url;
};

// eslint-disable-next-line no-unused-vars
export const find_repo_details = (src_dir = null) => {
	/**
     * Method to find repo details such as url, sha etc
       This will be populated into versionControlProvenance attribute

     * param src_dir: Source directory
     */
	// See if repository uri is specified in the config
	let repositoryName = null;
	let repositoryUri = '';
	let revisionId = '';
	let branch = '';
	let invokedBy = '';
	let pullRequest = false;
	let gitProvider = '';
	let ciProvider = '';

	/**
      Since CI servers typically checkout repo in detached mode, we need to rely on environment
      variables as a starting point to find the repo details. To make matters worse, since we
      run the tools inside a container these variables should be passed as part of the docker run
      command. With native integrations such as GitHub action and cloudbuild this could be taken
      care by our builders.

      Env variables detection for popular CI server is implemented here anyways. But they are effective
      only in few cases.

      Azure pipelines - https://docs.microsoft.com/en-us/azure/devops/pipelines/build/variables?view=azure-devops&tabs=yaml
      BitBucket - https://confluence.atlassian.com/bitbucket/environment-variables-in-bitbucket-pipelines-794502608.html
      GitHub actions - https://help.github.com/en/actions/automating-your-workflow-with-github-actions/using-environment-variables
      Google CloudBuild - https://cloud.google.com/cloud-build/docs/configuring-builds/substitute-variable-values
      CircleCI - https://circleci.com/docs/2.0/env-vars/#built-in-environment-variables
      Travis - https://docs.travis-ci.com/user/environment-variables/#default-environment-variables
      AWS CodeBuild - https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-env-vars.html
      GitLab - https://docs.gitlab.com/ee/ci/variables/predefined_variables.html
      Jenkins - https://jenkins.io/doc/book/pipeline/jenkinsfile/#using-environment-variables
    */
  // eslint-disable-next-line no-undef
	Object.entries(process.env).forEach(entry => {
		const [ key, value ] = entry;
		// Check REPOSITORY_URL first followed CI specific vars
		// Some CI such as GitHub pass only the slug instead of the full url :(
		if (!gitProvider || !ciProvider) {
			if (key.startsWith('GITHUB_')) {
				if (key === 'GITHUB_REPOSITORY') {
					gitProvider = 'github';
				}
				if (key === 'GITHUB_ACTION') {
					ciProvider = 'github';
				}
			} else if (key.startsWith('GITLAB_')) {
				gitProvider = 'gitlab';
				if (key === 'GITLAB_CI') {
					ciProvider = 'gitlab';
				}
			} else if (key.startsWith('BITBUCKET_')) {
				gitProvider = 'bitbucket';
				if (key === 'BITBUCKET_BUILD_NUMBER') {
					ciProvider = 'bitbucket';
				}
			} else if (key.startsWith('CIRCLE_')) {
				ciProvider = 'circle';
			} else if (key.startsWith('TRAVIS_')) {
				ciProvider = 'travis';
			} else if (key.startsWith('CODEBUILD_')) {
				ciProvider = 'codebuild';
			} else if (key.startsWith('BUILD_REQUESTEDFOREMAIL')) {
				ciProvider = 'azure';
			} else if (key.startsWith('JENKINS_')) {
				ciProvider = 'jenkins';
			}
		}

		if (!repositoryName) {
			if (
				[
					'BUILD_REPOSITORY_NAME',
					'GITHUB_REPOSITORY',
					'BITBUCKET_REPO_SLUG',
					'REPO_NAME',
					'CIRCLE_PROJECT_REPONAME',
					'TRAVIS_REPO_SLUG',
					'CI_PROJECT_NAME',
				].includes(key)
			) {
				if (value.includes('/')) {
					const valueArr = value.split('/');
					repositoryName = valueArr[valueArr.length - 1];
				} else {
					repositoryName = value;
				}
			}
		}
		if (!repositoryUri) {
			if (
				[
					'REPOSITORY_URL',
					'BUILD_REPOSITORY_URI',
					'GITHUB_REPOSITORY',
					'BITBUCKET_GIT_HTTP_ORIGIN',
					'REPO_NAME',
					'CIRCLE_REPOSITORY_URL',
					'TRAVIS_REPO_SLUG',
					'CODEBUILD_SOURCE_REPO_URL',
					'CI_REPOSITORY_URL',
				].includes(key)
			) {
				repositoryUri = value;
			}
		}
		if (
			[
				'COMMIT_SHA',
				'BUILD_SOURCEVERSION',
				'BITBUCKET_COMMIT',
				'GITHUB_SHA',
				'CIRCLE_SHA1',
				'TRAVIS_COMMIT',
				'CODEBUILD_SOURCE_VERSION',
				'CI_COMMIT_SHA',
			].includes(key)
		) {
			revisionId = value;
		}
		if (
			[
				'BRANCH',
				'BUILD_SOURCEBRANCH',
				'BITBUCKET_BRANCH',
				'GITHUB_REF',
				'BRANCH_NAME',
				'CIRCLE_BRANCH',
				'TRAVIS_BRANCH',
				'CI_COMMIT_REF_NAME',
			].includes(key)
		) {
			branch = value;
		}
		if (
			[
				'BUILD_REQUESTEDFOREMAIL',
				'GITHUB_ACTOR',
				'PROJECT_ID',
				'CIRCLE_USERNAME',
				'GITLAB_USER_EMAIL',
			].includes(key)
		) {
			invokedBy = value;
		}
		if (key.startsWith('CI_MERGE_REQUEST')) {
			pullRequest = true;
		}
	});

	if (branch.startsWith('refs/pull')) {
		pullRequest = true;
		branch = branch.replaceAll('refs/pull/', '');
	}
	// Cleanup the variables
	branch = branch.replaceAll('refs/heads/', '');
	if (repositoryUri) {
		repositoryUri = repositoryUri
			.replaceAll('git@github.com:', 'https://github.com/')
			.replaceAll('.git', '');
		// Is it a repo slug?
		let repo_slug = true;
		repositoryUri = sanitize_url(repositoryUri);
		repo_url_prefixes.some(pref => {
			if (repositoryUri.startsWith(pref)) {
				repo_slug = true;
				return true;
			}
			return false;
		});
		if (!repo_slug) {
			if (repositoryUri.includes('vs-ssh')) {
				repo_slug = false;
			}
		}
		// For repo slug just assume github for now
		if (repo_slug) {
			repositoryUri = `https://github.com/${repositoryUri}`;
		}
	}
	if (!repositoryName && repositoryUri) {
		repositoryName = path.basename(repositoryUri);
	}
	if (!gitProvider) {
		if (repositoryUri.includes('github')) {
			gitProvider = 'github';
		}
		if (repositoryUri.includes('gitlab')) {
			gitProvider = 'gitlab';
		}
		if (
			repositoryUri.includes('atlassian') ||
			repositoryUri.includes('bitbucket')
		) {
			gitProvider = 'bitbucket';
		}
		if (
			repositoryUri.includes('azure') ||
			repositoryUri.includes('visiualstudio')
		) {
			gitProvider = 'azure';
			if (!ciProvider) {
				ciProvider = 'azure';
			}
		}
		if (!gitProvider && repositoryUri.includes('tfs')) {
			gitProvider = 'tfs';
			ciProvider = 'tfs';
		}
	}
	return {
		gitProvider,
		ciProvider,
		repositoryName: !repositoryName ? '' : repositoryName,
		repositoryUri,
		revisionId,
		branch,
		invokedBy,
		pullRequest,
	};
};

export const convert_dataflow = (working_dir, dataflows) => {
  /*
  Convert dataflow into a simpler source and sink format for better representation in SARIF based viewers

  * param dataflows: List of dataflows from Inspect
  * return List of filename and location
  */

  if (dataflows.length === 0) {
		return null;
	};

	const loc_list = [];
  // eslint-disable-next-line no-restricted-syntax
	for (const flow of dataflows) {
		if (!flow.location.file_name || !flow.location.line_number) {
			continue;
		}
		loc_list.push(
      {
        'filename': path.join(working_dir, flow.location.file_name),
        'line_number': flow.location.line_number
      });
	}
	return loc_list;
}

export const extract_from_file = (
	tool_name,
	working_dir,
	joern_findings_json,
) => {
	/*
  Extract properties from reports

  :param tool_name: tool name
  :param tool_args: tool args
  :param working_dir: Working directory
  :param report_file: Report file
  :param file_path_list: Full file path for any manipulation

  :return issues, metrics, skips information
  */

	const issues = [];
	if (joern_findings_json.length === 0) {
		return issues;
	}

	if (['joern', 'ocular'].includes(tool_name)) {
		// eslint-disable-next-line no-restricted-syntax
		for (const value of joern_findings_json) {
			if (!value || Object.keys(value).length === 0 || !value._label === 'FINDING') {
				continue;
			}
			const keyValuePairs = value.keyValuePairs;
			const kv_obj = {};
			const codeflows = [];
			const file_locations = {};
			// eslint-disable-next-line no-restricted-syntax
			for (const kv of keyValuePairs) {
				if (kv._label === 'KEY_VALUE_PAIR') {
					kv_obj[kv['key']] = kv['value'];
				}
			}
			const evidence = value.evidence;
			let fingerprint = null;
			let source = null;
			let sink = null;
			// eslint-disable-next-line no-restricted-syntax
			for (const ev of evidence) {
				if (!fingerprint) {
					fingerprint = ev.fingerprint;
				}
				const source_obj = ev.source;
				if (source_obj?.method?.filename) {
					source = {
						filename: path.join(
							working_dir,
							source_obj.method.filename,
						),
						line_number: source_obj.method.lineNumber,
						fullName: source_obj.method.fullName,
					};
					const key = `${source.filename}:${source.line_number}`;
					if (!file_locations[key]) {
						codeflows.push(source);
						file_locations[key] = 1;
					}
				}
				const sink_obj = ev.sink;
        if (sink_obj && Object.keys(sink_obj).length > 0) {
					if (sink_obj?.method?.filename) {
						sink = {
							filename: path.join(
								working_dir,
								sink_obj.method.filename,
							),
							line_number: sink_obj.method.lineNumber,
							fullName: sink_obj.method.fullName,
						};
					} else if (sink_obj?.callingMethod?.filename) {
						sink = {
							filename: path.join(
								working_dir,
								sink_obj.callingMethod.filename,
							),
							line_number: sink_obj.callingMethod.lineNumber,
							fullName: sink_obj.callingMethod.fullName,
						};
					}
					const key = `${sink.filename}:${sink.line_number}`;
					if (sink && !file_locations[key]) {
						codeflows.push(sink);
						file_locations[key] = 1;
					}
				}
				if (fingerprint && (source || sink)) {
					break;
				}
			}
			issues.push({
				rule_id: kv_obj['name'],
				title: kv_obj['TitleTemplate'],
				short_description: kv_obj['VulnerabilityDescription'],
				description: kv_obj['DescriptionTemplate'],
				issue_severity: kv_obj['Score'],
				line_number: sink ? sink.line_number : source.line_number,
				filename: sink ? sink.filename : source.filename,
				issue_confidence: 'HIGH',
				fingerprint,
				codeflows,
			});
		}
  }else if(["ng-sast", "core"].includes(tool_name)){// NG SAST (Formerly Inspect) uses vulnerabilities
    let data_to_use = joern_findings_json
    // Is this raw json
    if (joern_findings_json["ok"]){
        const response = joern_findings_json["response"]
        if(response && Object.keys(response).length > 0){
            data_to_use = {
                [response.scan?.app]: response.findings
            }
        }
    };
    // eslint-disable-next-line no-restricted-syntax
    for (const v in Object.values(data_to_use)){
      if(v?.length === 0){
        continue;
      };

      v.forEach(vuln=>{

        let location = {};
        let codeflows = [];
        let score = "";
        const vuln_type = vuln["type"];
        const details = vuln["details"] || {};
        const file_locations = details["file_locations"] || [];
        const tags = vuln["tags"] || [];
        const internal_id = vuln["internal_id"];
        const tmpA = internal_id.split("/");
        const rule_id = tmpA[0];
        const fingerprint = tmpA[tmpA.length - 1];
        const cvss_tag = [];

        tags.forEach(t=>{
          if (t["key"] === "cvss_score"){
            cvss_tag.push(t);
          }
        });

        if(cvss_tag.length > 0){
          score = cvss_tag[0]["value"];
        };

        if(vuln_type === "extscan"){
          location = {
            filename: path.join(working_dir, details["fileName"]),
            line_number: details["lineNumber"]
          };
          codeflows.push(location);
        } else if(file_locations?.length > 0){
          file_locations.forEach(floc=>{
            const flocArr = floc.split(":");
            codeflows.push({
              filename: path.join(working_dir, flocArr[0]),
              line_number: flocArr[1]
            });
          });
          location = codeflows[codeflows.length - 1];
        };

        if(Object.keys(location).length === 0 && details["dataflow"]){
          const dataflows = details["dataflow"]["list"];
          if(dataflows?.length > 0){
            const location_list = convert_dataflow(working_dir, dataflows);
            if(location_list?.length > 0){
                codeflows = location_list;
                location = location_list[location_list.length - 1];
            }
          }
        };

        if(Object.keys(location).length > 0){
          issues.push(
            {
              rule_id,
              title: vuln["title"],
              short_description: vuln["category"],
              description: vuln["description"],
              score,
              severity: vuln["severity"],
              line_number: location["line_number"],
              filename: location["filename"],
              first_found: vuln["version_first_seen"],
              issue_confidence: "HIGH",
              fingerprint,
              codeflows,
          }
          )
        }
      });
    }
	}

	return issues;
};

export const add_region_and_context_region = (
	physical_location,
	line_number,
	code,
) => {
	/* This adds the region information for displaying the code snippet
  :param physical_location: Points to file
  :param line_number: Line number suggested by the tool
  :param code: Source code snippet
  */
	let end_line_number;
	let snippet_line;
	const parsed_code = parse_code(code);
	let first_line_number = parsed_code[0];
	const snippet_lines = parsed_code[1];

	if (first_line_number === 0) {
		first_line_number = 1;
	}

	end_line_number = first_line_number + snippet_lines.length - 1;

	if (end_line_number < first_line_number) {
		end_line_number = first_line_number + 3;
	}

	const index = line_number - first_line_number;
	snippet_line = '';

	if (line_number === 0) {
		line_number = 1;
	}

	if (snippet_lines && snippet_lines.length > index) {
		if (index > 0) {
			snippet_line = snippet_lines[index];
		} else {
			snippet_line = snippet_lines[0];
		}
	}

	if (snippet_line.trim().replaceAll('\n', '') === '') {
		snippet_line = '';
	}

	physical_location.region = {
		snippet: {
			text: snippet_line,
		},
		startLine: line_number,
	};

	if (snippet_lines.length > 0) {
		physical_location.context_region = {
			snippet: {
				text: snippet_lines.join(''),
			},
			endLine: end_line_number,
			startLine: first_line_number,
		};
	}
};

export const fix_filename = (working_dir, filename) => {
	/* Method to prefix filename based on workspace
   :param working_dir: Working directory
  :param filename: File name to fix
  */
	// let WORKSPACE_PREFIX = os.getenv("WORKSPACE", null);
	const WORKSPACE_PREFIX = null;

	if (working_dir) {
		if (WORKSPACE_PREFIX === null && !filename.startsWith(working_dir)) {
			filename = path.join(working_dir, filename);
		}

		if (WORKSPACE_PREFIX !== null) {
			if (WORKSPACE_PREFIX === '') {
				filename = filename.replaceAll(
					`^${working_dir}`,
					WORKSPACE_PREFIX,
				);
			} else if (!filename.startsWith(working_dir)) {
				filename = path.join(WORKSPACE_PREFIX, filename);
			} else {
				filename = filename.replaceAll(
					`^${working_dir}`,
					WORKSPACE_PREFIX,
				);
			}
		}
	}

	return filename;
};

export const create_result = (
	tool_name,
	issue,
	rules,
	rule_indices,
	working_dir,
) => {
	/* Method to convert a single issue into result schema with rules
	 * param tool_name: tool name
	 * param issue: Issues object
	 * param rules: List of rules
	 * param rule_indices: Indices of referred rules
	 * param file_path_list: Full file path for any manipulation
	 * param working_dir: Working directory
	 */
	if (issue.constructor === Object) {
		issue = issue_from_dict(issue);
	}
	const issue_obj = issue.as_dict();
	const [rule, rule_index] = create_or_find_rule(
		tool_name,
		issue_obj,
		rules,
		rule_indices,
	);
	const filename = fix_filename(working_dir, issue_obj['filename']);

	const physical_location = {
		artifactLocation: {
			uri: to_uri(filename),
		},
	};
	add_region_and_context_region(
		physical_location,
		issue_obj['line_number'],
		issue_obj['code'],
	);
	const thread_flows_list = [];
	const issue_severity = issue_obj['issue_severity'];
	const fingerprint = {
		evidenceFingerprint: issue_obj['line_hash'],
	};
	if (issue_obj.codeflows) {
		const thread_locations = [];
		// eslint-disable-next-line no-restricted-syntax
		for (const cf of issue_obj.codeflows) {
			if (cf.filename && cf.line_number) {
				const thread_physical_location = {
					artifactLocation: {
						uri: to_uri(fix_filename(working_dir, cf['filename'])),
					},
					region: {
						snippet: {
							text: '',
						},
						startLine: Number(cf['line_number']),
					},
				};

				thread_locations.push({
					location: {
						physicalLocation: thread_physical_location,
					},
				});
			}
		}
		if (thread_locations) {
			thread_flows_list.push({
				locations: thread_locations,
			});
		}
	}

	const result = {
		message: {
			markdown: issue_obj['title'],
			text: issue_obj['title'].replaceAll('`', ''),
		},
		locations: [
			{
				physicalLocation: physical_location,
			},
		],
		properties: {
			issue_confidence: issue_obj['issue_confidence'],
			issue_severity,
			issue_tags: issue_obj.tags || {},
		},
		baselineState: issue_obj['first_found'] ? 'unchanged' : 'new',
		partialFingerprints: fingerprint,
		ruleId: rule.id,
		ruleIndex: rule_index,
	};

	if (thread_flows_list) {
		result.codeFlows = [
			{
				threadFlows: thread_flows_list,
			},
		];
	}
	return result;
};

export const add_results = (tool_name, issues, run, working_dir = null) => {
	/* Method to convert issues into results schema
	 * param tool_name: tool name
	 * param issues: Issues found
	 * param run: Run object
	 * param file_path_list: Full file path for any manipulation
	 * param working_dir: Working directory
	 */

	if (run.results === null) {
		run.results = [];
	}
	const rules = {};
	const rule_indices = {};
	// eslint-disable-next-line no-restricted-syntax
	for (const issue of issues) {
		const result = create_result(
			tool_name,
			issue,
			rules,
			rule_indices,
			working_dir,
		);
		if (result) {
			run.results.push(result);
		}
	}
	if (Object.keys(rules).length > 0) {
		run.tool.driver.rules = Object.values(rules);
	}
};

export const report = (
	tool_name = 'joern',
	tool_args = ['--script', 'oc_scripts/scan.sc'],
	working_dir = '',
	issues = null
) => {
	/**
   * Prints issues in SARIF format

    :param tool_name: tool name
    :param tool_args: Args used for the tool
    :param working_dir: Working directory
    :param issues: issues data
    :param crep_fname: The output file name
    :param file_path_list: Full file path for any manipulation

    :return serialized_log: SARIF output data
   */

	if (!tool_args) {
		tool_args = [];
	}
	let tool_args_str = tool_args;
	if (Array.isArray(tool_args)) {
		tool_args_str = tool_args.join('');
	}
	const repo_details = find_repo_details(working_dir);
	const log_uuid = uuid_v4();
	const run_uuid = uuid_v4();
	// let WORKSPACE_PREFIX = os.getenv ('WORKSPACE', null);
	const WORKSPACE_PREFIX = null;
	const wd_dir_log =
		WORKSPACE_PREFIX !== null ? WORKSPACE_PREFIX : working_dir;
	let driver_name = default_driver_name;
	let information_uri = 'https://joern.io';
	if (tool_drivers[tool_name]) {
		driver_name = tool_drivers[tool_name];
		information_uri = 'https://shiftleft.io';
	}

	const log = {
		version: '2.1.0',
		$schema:
			'https://raw.githubusercontent.com/oasis-tcs/sarif-spec/master/Schemata/sarif-schema-2.1.0.json',
		inlineExternalProperties: [
			{
				guid: log_uuid,
				runGuid: run_uuid,
			},
		],
		runs: [
			{
				tool: {
					driver: {
						name: driver_name,
						version: '1.0.0',
						fullName: driver_name,
						informationUri: information_uri,
					},
				},
				automationDetails: {
					description: {
						text: `Static Analysis Security Test results using ${tool_name}`,
					},
					guid: log_uuid,
				},
				conversion: {
					tool: {
						driver: {
							name: tool_name,
						},
					},
					invocation: {
						arguments: tool_args,
						executionSuccessful: true,
						commandLine: tool_args_str,
						endTimeUtc: new Date().toISOString(),
						workingDirectory: {
							uri: to_uri(wd_dir_log),
						},
					},
				},
				versionControlProvenance: [
					{
						branch: repo_details['branch'],
						repositoryUri: repo_details['repositoryUri'],
						revisionId: repo_details['revisionId'],
					},
				],
				invocations: [
					{
						executionSuccessful: true,
						endTimeUtc: new Date().toISOString(),
						workingDirectory: {
							uri: to_uri(wd_dir_log),
						},
					},
				],
				results: null,
			},
		],
	};

	const run = log.runs[0];
	add_results(tool_name, issues, run, working_dir);
	const serialized_log = log;
	return serialized_log;
};

// convert_file("joern", "", "./", src_file)
export const convert_file = (
	tool_name,
	tool_args,
	working_dir,
	joern_findings_json
) => {
	/* Convert report file
   :param tool_name: tool name
  :param tool_args: tool args
  :param working_dir: Working directory
  :param joern_findings_json: Report finding json
   :return serialized_log: SARIF output data
  */
	const issues = extract_from_file(
		tool_name,
		working_dir,
		joern_findings_json,
	);
	return report(tool_name, tool_args, working_dir, issues);
};
