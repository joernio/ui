import fs from 'fs';
import { isFilePathInQueryResult } from '../../assets/js/utils/scripts';
import { Range } from 'monaco-editor';

let delta_decorations = [];

export const handleFileAddedToRecent = async (refs, props) => {
  let path = props?.files?.recent ? {...props.files.recent} : null;
  path = path && Object.keys(path);
  path = path ? path.pop() : null;

  return await readRecentFile(path)
    .then(data => {
      const readOnly = path.slice(path.length - 3) === '.sc' ? false : true;

      const { startLine, endLine } = shouldGoToLine(props);

      setTimeout(() => {
          goToLine(refs.editorEl.current.editor, startLine);
          highlightRange(refs.editorEl.current.editor, {
            startLine,
            endLine,
          });
        }, 1000);

      return { openFileContent: data, isReadOnly: readOnly };
    })
    .catch(() => {
      if (!path || path === path.split('/')[path.split('/').length - 1]) {
        return { openFileContent: '', isReadOnly: false };
      }
    });
};

export const goToLine = (editor, row = 1, column = 1) => {
  editor.setPosition({ column: column, lineNumber: row ? row : 1 });
  editor.revealLineInCenter(row ? row : 1);
};

export const highlightRange = (editor, range) => {
  const rangeArr = [];

  if (range.startLine && !range.endLine) {
    rangeArr.push(range.startLine, 0, range.startLine, 0);
  } else if (!range.startLine && range.endLine) {
    rangeArr.push(range.endLine, 0, range.endLine, 0);
  } else if (range.startLine && range.endLine) {
    rangeArr.push(range.startLine, 0, range.endLine, 0);
  } else {
    rangeArr.push(0, 0, 0, 0);
  }

  if (rangeArr.length) {
    delta_decorations = editor.deltaDecorations(
      delta_decorations,
      [
        {
          range: new Range(...rangeArr),
          options: range.startLine || range.endLine ? {
            isWholeLine: true,
            inlineClassName: 'editor-line-highlight',
          }:{},
        },
      ],
    );
  }
};

export const editorDidMount = (editor, monaco) => {

  editor.focus();
  monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true,
    noSyntaxValidation: true,
  });
};

export const readRecentFile = path => {
  return new Promise((resolve, reject) => {
    if (path) {
      fs.readFile(path, 'utf8', (err, data) => {
        if (!err) {
          resolve(data);
        } else {
          reject(err);
        }
      });
    } else {
      reject();
    }
  });
};

const isLineNumberInQueryResult = results => {
  const latest = results[Object.keys(results)[Object.keys(results).length - 1]];
  let range = { startLine: null, endLine: null };

  if (latest?.result.stdout && latest.result.stdout.includes('lineNumber')) {
    try {
      let startLine = latest.result.stdout.split(
        'lineNumber -> Some(value = ',
      )[1];
      startLine = startLine.split('),')[0];
      range.startLine = Number(startLine);

      let endLine = latest.result.stdout.split(
        'lineNumberEnd -> Some(value = ',
      )[1];
      endLine = endLine.split('),')[0];
      range.endLine = Number(endLine);

      return range;
    } catch (e) {
      try {
        let startLine = latest.result.stdout.split(
          'lineNumber = Some(value = ',
        )[1];
        startLine = startLine.split('),')[0];
        range.startLine = Number(startLine);

        let endLine = latest.result.stdout.split(
          'lineNumberEnd = Some(value = ',
        )[1];
        endLine = endLine.split('),')[0];
        range.endLine = Number(endLine);

        return range;
      } catch (e) {
        return range;
      }
    }
  } else {
    return range;
  }
};

export const shouldGoToLine = props => {
  let { recent: recent_file } = {...props.files};
  recent_file = Object.keys(recent_file)?.pop();

  const { results } = props.query;
  const file_path = isFilePathInQueryResult(results);

  if (file_path === recent_file && recent_file) {
    return isLineNumberInQueryResult(results);
  } else {
    return { startLine: null, endLine: null };
  }
};
