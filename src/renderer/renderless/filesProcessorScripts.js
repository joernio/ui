import {
  openFile,
  openSyntheticFile,
  isFilePathInQueryResult,
  isQueryResultToOpenSynthFile,
} from '../assets/js/utils/scripts';
import { editorShouldGoToLine } from '../views/editor_window/editorScripts';

/**
 * Process files
 * @param {*} props
 */
export const processFiles = async props => {
  console.log('processFiles: ', props);
  const file_path = isFilePathInQueryResult(props.query.results);
  file_path && (await openFile(file_path));
  file_path && editorShouldGoToLine();

  const { synth_file_path, content } = await isQueryResultToOpenSynthFile(
    props.query.results,
  );

  synth_file_path && content && openSyntheticFile(synth_file_path, content);
};

// import fs from 'fs';
// import { getDirectories } from '../assets/js/utils/scripts';

// export const getOpenProjectInputPath = workspace => {
//   const { projects } = workspace;
//   let path = null;

//   projects &&
//     Object.keys(projects).forEach(name => {
//       if (projects[name].open) {
//         path = projects[name].inputPath;
//       }
//     });

//   let root = path ? path.split('/') : null;
//   root = root ? root[root.length - 1] : null;

//   return { path, root };
// };

// export const isFileInOpenFiles = (file_path, openFiles) => {
//   if (file_path) {
//     return Object.keys(openFiles).includes(file_path);
//   } else {
//     return true;
//   }
// };

// export const getFilePathToOpen = async workspace => {
//   const { path: inputPath } = getOpenProjectInputPath(workspace);
//   let file_path;

//   if (inputPath) {
//     await getDirectories(inputPath)
//       .then(async paths => {
//         let promisesArr = [];

//         for (let path of paths) {
//           if (!file_path) {
//             let promise = new Promise((resolve, reject) => {
//               fs.stat(path, (err, stats) => {
//                 if (!err) {
//                   resolve(stats);
//                 } else {
//                   reject(err);
//                 }
//               });
//             })
//               .then(stats => {
//                 if (stats.isFile()) {
//                   file_path = path;
//                 }
//               })
//               .catch(err => {
//                 console.log('error getting path stats', err);
//               });

//             promisesArr.push(promise);
//           }
//         }

//         await Promise.any(promisesArr);
//       })
//       .catch(err => {
//         console.log('error getting path directories', err);
//       });
//   }

//   return file_path;
// };
