import { cpgManagementCommands as manCommands } from '../assets/js/utils/defaultVariables';
import { parseProject, parseProjects } from '../assets/js/utils/scripts';

export const modifyWorkSpaceNameAndActiveProject = (obj, workspace) => {
  const {
    pathToWorkSpace,
    pathToProject,
    activeProjectName,
    inputPath,
    cpg,
    language,
  } = obj;
  workspace.path = pathToWorkSpace;

  Object.keys(workspace.projects).map(projectName => {
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
      cpg: activeProject && activeProject.cpg ? activeProject.cpg : cpg,
      language:
        activeProject && activeProject.language
          ? activeProject.language
          : language,
    };
    workspace.projects[activeProjectName] = activeProject;
  }

  return workspace;
};

export const extractWorkSpaceNameAndActiveProject = parsedProject => {
  const {
    name: activeProjectName,
    inputPath,
    path: pathToProject,
    cpg,
    language,
  } = parsedProject;
  const pathToWorkSpace = pathToProject
    ? pathToProject.split('workspace')[0] + 'workspace'
    : null;
  return {
    pathToWorkSpace,
    pathToProject,
    activeProjectName,
    inputPath,
    cpg,
    language,
  };
};

export const extractLanguageFromString = str => {
  // console.log('extractLanguageFromString: ', str);
  try {
    return str.split('"')[1];
  } catch {
    return null;
  }
};

export const processQueryResult = (query_result, props) => {
  const {
    query,
    project: parsed_project,
    workspace: parsed_workspace,
    result,
  } = query_result;

  // console.log('workspaceProcessor: query is', query, ' result is: ', result);

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
    // console.log('workspaceProcessor: query is cpg.language query');
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
    // console.log('inside workspaceProcessor: query is workspace query');
    // console.log('workspace is: ', JSON.stringify(workspace));

    const workspace_name_and_active_project =
      extractWorkSpaceNameAndActiveProject(parsed_project);
    workspace = modifyWorkSpaceNameAndActiveProject(
      workspace_name_and_active_project,
      workspace,
    );

    // console.log(
    //   'after workspace_name _and_active_project, workspace is: ',
    //   JSON.stringify(workspace),
    // );

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
