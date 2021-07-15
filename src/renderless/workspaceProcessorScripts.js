import { joernManagementCommands as manCommands } from '../assets/js/utils/defaultVariables';
import { parseProject, parseProjects } from '../assets/js/utils/scripts';

export const modifyWorkSpaceNameAndActiveProject = (obj, workspace) => {
  const { pathToWorkSpace, pathToProject, activeProjectName, inputPath } = obj;
  workspace.path = pathToWorkSpace;

  Object.keys(workspace.projects).map(projectName => {
    if (projectName !== activeProjectName) {
      workspace.projects[projectName].open = false;
    }
  });

  if (activeProjectName) {
    const activeProject = { inputPath, pathToProject, open: true };
    workspace.projects[activeProjectName] = activeProject;
  }

  return workspace;
};

export const extractWorkSpaceNameAndActiveProject = parsedProject => {
  const {
    name: activeProjectName,
    inputPath,
    path: pathToProject,
  } = parsedProject;
  const pathToWorkSpace = pathToProject
    ? pathToProject.split('workspace')[0] + 'workspace'
    : null;
  return { pathToWorkSpace, pathToProject, activeProjectName, inputPath };
};

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
  } else if (query === 'project' && (result.stdout || result.stderr)) {
    //if project query
    const parsed_project = parseProject(result);

    props.setProjects(parsed_workspace['projects']);
    let { workspace } = props;
    workspace.projects = parsed_workspace['projects'];

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
    props.setProjects(parsed_workspace['projects']);
  }
};

export const shouldProcessQueryResult = results => {
  const latest = results[Object.keys(results)[Object.keys(results).length - 1]];
  if (latest?.project || latest?.workspace) {
    return latest;
  }
};
