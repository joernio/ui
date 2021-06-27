import { nanoid } from 'nanoid';
import { selectDirApi } from '../../assets/js/utils/ipcRenderer';

export const addToQueue = (query, props) => {
  if (query) {
    props.enQueueQuery(query);
  }
};

export const addWorkSpaceQueryToQueue = () => {
  const query = {
    query: 'workspace',
    origin: 'workspace',
    ignore: true,
  };

  return query;
};

export const handleOpenWorkSpaceContextMenu = e => {
  return { workspace_context_anchor_el: e.currentTarget };
};

export const handleCloseWorkSpaceContextMenu = () => {
  return { workspace_context_anchor_el: null };
};

export const contructQueryWithFilePath = (e, type = 'importCode') => {
  if (e?.target?.files[0]?.path) {
    let path;
    let random_name = nanoid();
    random_name = random_name.slice(0, random_name.length / 4);

    if (type === 'importCode') {
      path = e.target.files[0].path;
      path = path.split('/');
      path = path.slice(0, path.length - 1).join('/');
    } else if (type === 'importCpg') {
      path = e.target.files[0].path;
    }

    const query = {
      query: `${type}(inputPath="${path}", projectName="${random_name}")`,
      origin: 'workspace',
      ignore: false,
    };

    return query;
  }
};

export const handleSwitchWorkspace = async e => {
  selectDirApi.selectDir();

  const path = await new Promise((resolve, reject) => {
    selectDirApi.registerListener(value => {
      if (value) {
        resolve(value);
      } else {
        reject();
      }
    });
  }).catch(() => {
    console.log("can't select workspace path");
  });

  if (path) {
    const query = {
      query: `switchWorkspace("${path}")`,
      origin: 'workspace',
      ignore: false,
    };

    return query;
  }

  // selectDirApi.registerListener(path => {
  //   if (path) {
  //     const query = {
  //       query: `switchWorkspace("${path}")`,
  //       origin: 'workspace',
  //       ignore: false,
  //     };
  //     addToQueue(query, props);
  //   }
  // });
};

export const handleOpenProject = name => {
  if (name) {
    const query = {
      query: `open("${name}")`,
      origin: 'workspace',
      ignore: false,
    };
    return query;
  }
};

export const handleCloseProject = name => {
  if (name) {
    const query = {
      query: `close("${name}")`,
      origin: 'workspace',
      ignore: false,
    };
    return query;
  }
};

export const handleDeleteProject = name => {
  if (name) {
    const query = {
      query: `delete("${name}")`,
      origin: 'workspace',
      ignore: false,
    };
    return query;
  }
};
