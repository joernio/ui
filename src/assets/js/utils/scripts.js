import { nanoid } from 'nanoid';
import glob from 'glob';
import { joernManagementCommands as manCommands } from './defaultVariables';
import {
  deQueueQuery,
  getQueryResult,
  postQuery,
  setResults,
} from '../../../store/actions/queryActions';
import { store } from '../../../store/configureStore';

export const performEnQueueQuery = (query, queue) => {
  const key = `${Object.keys(queue).length}-${nanoid()}`;
  queue[key] = query;

  return queue;
};

export const performDeQueueQuery = queue => {
  const key = Object.keys(queue).shift();
  if (key) {
    const query = queue[key];
    delete queue[key];
    return { queue, query };
  } else {
    return { queue, query: null };
  }
};

export const performPeekQueue = queue => {
  const key = Object.keys(queue)[0];
  const query = queue[key];
  return query ? query : null;
};

export const performPushResult = (result, results) => {
  const key = Object.keys(result)[0];
  results[key] = result[key];
  return results;
};

export const parseProjects = data => {
  if (data.stdout.split('=')[1].trim().startsWith('empty')) {
    return {};
  } else {
    const parsed = data.stdout
      .split('\n')
      .filter(str => (str ? str : false))
      .slice(4)
      .map(str => str.split('|'));
    const projects = {};

    parsed.forEach(arr => {
      projects[arr[1].trim()] = {
        inputPath: arr[3].trim(),
        pathToProject: null,
        open: null,
      };
    });

    return projects;
  }
};

export const parseProject = data => {
  let inputPath, name, path;

  if (data.stdout) {
    try {
      [inputPath, name, path] = data.stdout.split('(')[2].split(',');

      inputPath = inputPath.split('"')[1];
      name = name.split('"')[1];
      path = path.split('=')[1].trim();
    } catch {
      [inputPath, name, path] = data.stdout.split('(')[3].split(',');

      inputPath = inputPath.split('"')[1];
      name = name.split('"')[1];
      path = path.split('=')[1].trim();
    }
  } else {
    inputPath = name = path = null;
  }

  return { name, inputPath, path };
};

const performPostQuery = (store, result) => {
  let post_query;

  if (
    result.query.startsWith(manCommands.switchWorkspace) ||
    result.query === 'project'
  ) {
    post_query = 'workspace';
  } else {
    post_query = 'project';
  }

  store.dispatch(postQuery(post_query));
};

const setQueryResult = (data, store, key, results) => {
  if (!results[key].result.stdout && !results[key].result.stderr) {
    if (data.stdout) {
      results[key]['result']['stdout'] = data.stdout;
    }

    if (data.stderr) {
      results[key]['result']['stderr'] = data.stderr;
    }

    store.dispatch(setResults(results));
  } else if (
    results[key].query.startsWith(manCommands.switchWorkspace) ||
    results[key].query === 'project'
  ) {
    if (data.stdout) {
      const projects = parseProjects(data);
      results[key]['workspace'] = { projects };
      store.dispatch(setResults(results));
    }
  } else {
    results[key]['project'] = parseProject(data);
    store.dispatch(setResults(results));
  }
};

export const handleWebSocketResponse = data => {
  getQueryResult(data.utf8Data)().then(data => {
    const { results } = store.getState().query;
    const key = Object.keys(results)[Object.keys(results).length - 1];
    const latest = results[key];

    if (!latest.result.stdout && !latest.result.stderr) {
      setQueryResult(data, store, key, results);
      performPostQuery(store, results[key]);
    } else {
      setQueryResult(data, store, key, results);
      store.dispatch(deQueueQuery());
    }
  });
};

export const openFile = (path, props) => {
  if(path){
    const files = props.files;
    delete files.recent[path];
    files.recent[path] = true;
    props.setRecent(files);
  }
};

export const getDirectories = src =>
  new Promise((resolve, reject) => {
    glob(src + '/**/*', (err, path) => {
      if (!err) {
        resolve(path);
      } else {
        reject(err);
      }
    });
  });

export const getFolderStructureRootPath = workspace => {
  const { projects } = workspace;
  let path = null;

  projects &&
    Object.keys(projects).forEach(name => {
      if (projects[name].open) {
        path = projects[name].inputPath;
      }
    });

  path = path
    ? path
        .split('/')
        .slice(0, path.split('/').length - 1)
        .join('/')
    : null;
  let root = path ? path.split('/') : null;
  root = root ? root[root.length - 1] : null;


  return { path, root };
};

// const parseWorkSpaceNameAndActiveProject = parsedProject => {
//     const {
//       name: activeProjectName,
//       inputPath,
//       path: pathToProject,
//     } = parsedProject;
//     const pathToWorkSpace = pathToProject
//       ? pathToProject.split('workspace')[0] + 'workspace'
//       : null;
//     return { pathToWorkSpace, pathToProject, activeProjectName, inputPath };
//   };

// const queueIsEqual = (prev, current) => {
//       if (!prev && !current) return true;
//       if ((!prev || !current) && prev !== current) return false;
//       if (Object.keys(prev).length !== Object.keys(current).length) return false;
//       if (
//         Object.keys(prev).filter(key => (current[key] ? true : false)).length !==
//         Object.keys(current).length
//       )
//         return false;
//       return true;
//     };
