import { cpgManagementCommands as manCommands } from '../assets/js/utils/defaultVariables';
import {
	parseProject,
	parseProjects,
	handleSetToast,
} from '../assets/js/utils/scripts';

/**
 * modify space name and active project
 * @param {*} obj
 * @param {*} workspace
 * @returns
 */
export const modifyWorkSpaceNameAndActiveProject = (obj, workspace) => {
	const {
		pathToWorkSpace,
		pathToProject,
		activeProjectName,
		inputPath,
		language,
	} = obj;
	workspace.path = pathToWorkSpace;

	Object.keys(workspace.projects).forEach(projectName => {
		if (projectName !== activeProjectName) {
			workspace.projects[projectName].open = false;
		}
	});

	if (activeProjectName) {
		let activeProject = workspace.projects[activeProjectName];
		activeProject = {
			inputPath,
			pathToProject,
			open: true,
			cpg: activeProject?.cpg,
			language: language || activeProject?.language,
		};
		workspace.projects[activeProjectName] = activeProject;
	}

	return workspace;
};

/**
 * extract workspace name and active project
 * @param {*} parsedProject
 * @returns
 */
export const extractWorkSpaceNameAndActiveProject = parsedProject => {
	const {
		name: activeProjectName,
		inputPath,
		path: pathToProject,
	} = parsedProject;

	const pathToWorkSpace = pathToProject
		? `${pathToProject.split('workspace')[0]}workspace`
		: null;

	return {
		pathToWorkSpace,
		pathToProject,
		activeProjectName,
		inputPath,
	};
};

/**
 * extract language from string
 * @param {*} str
 * @returns
 */
export const extractLanguageFromString = str => {
	try {
		const language = str.split('"')[1];
		if (language) {
			return language;
		}
		handleSetToast({
			icon: 'warning-sign',
			intent: 'danger',
			message:
				'This language is not yet supported. The backend was unable to generate a graph and no graph is loaded for this project',
		});
		return 'Unsupported';
	} catch {
		handleSetToast({
			icon: 'warning-sign',
			intent: 'danger',
			message:
				'authentication error. Your server requires authentication',
		});
		return 'Unsupported';
	}
};

/**
 * process query result
 * @param {*} query_result
 * @param {*} props
 */
export const processQueryResult = (query_result, props) => {
	const {
		query,
		project: parsed_project,
		workspace: parsed_workspace,
		result,
	} = query_result;

	if (query.startsWith(manCommands.delete) && result.stdout) {
		// if delete query
		const query = {
			query: 'workspace',
			origin: 'workspace',
			ignore: true,
		};
		props.enQueueQuery(query);
	} else if (query === manCommands.cpgLanguage && result.stdout) {
		// if language query
		const workspace_name_and_active_project =
			extractWorkSpaceNameAndActiveProject(parsed_project);

		workspace_name_and_active_project.language = extractLanguageFromString(
			result.stdout,
		);

		let { workspace } = props;
		workspace = modifyWorkSpaceNameAndActiveProject(
			workspace_name_and_active_project,
			workspace,
		);
		props.setWorkSpace(workspace);
	} else if (query === 'project' && (result.stdout || result.stderr)) {
		// if project query
		const parsed_project = parseProject(result);

		props.setProjects(parsed_workspace.projects);
		let { workspace } = props;
		workspace.projects = parsed_workspace.projects;

		const workspace_name_and_active_project =
			extractWorkSpaceNameAndActiveProject(parsed_project);
		workspace = modifyWorkSpaceNameAndActiveProject(
			workspace_name_and_active_project,
			workspace,
		);

		props.setWorkSpace(workspace);
	} else if (query === 'workspace' && result.stdout) {
		// if workspace query
		const parsed_projects = parseProjects(result);

		let { workspace } = props;
		workspace.projects = parsed_projects;

		const workspace_name_and_active_project =
			extractWorkSpaceNameAndActiveProject(parsed_project);
		workspace = modifyWorkSpaceNameAndActiveProject(
			workspace_name_and_active_project,
			workspace,
		);

		props.setWorkSpace(workspace);
	} else if (parsed_project) {
		// if any other query with parsed project in result
		const workspace_name_and_active_project =
			extractWorkSpaceNameAndActiveProject(parsed_project);
		let { workspace } = props;
		workspace = modifyWorkSpaceNameAndActiveProject(
			workspace_name_and_active_project,
			workspace,
		);

		props.setWorkSpace(workspace);
	} else if (parsed_workspace) {
		// if any other query with  parsed workspace in result
		props.setProjects(parsed_workspace.projects);
	}
};

/**
 * Show if query result will be processed
 * @param {*} results
 * @returns
 */
export const shouldProcessQueryResult = results => {
	const latest =
		results[Object.keys(results)[Object.keys(results).length - 1]];
	if (latest?.project || latest?.workspace) {
		return latest;
	}
};
