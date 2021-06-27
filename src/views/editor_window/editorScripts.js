import fs from 'fs';

export const goToLine = (editor, row = 1, column = 1) => {
  editor.setPosition({ column: column, lineNumber: row });
  editor.revealLineInCenter(row);
};

export const editorDidMount = (editor, monaco) => {
  editor.focus();
};

export const readRecentFile = props => {
      return new Promise((resolve, reject) => {
        const { recent } = props.files;

        if (recent) {
          let path = Object.keys(recent);
          path = path ? path.pop() : null;

          if(path){
            fs.readFile(path, 'utf8', (err, data) => {
              if (!err) {
                resolve(data);
              } else {
                reject(err);
              }
            });
          }else{
            reject();
          }
        }  else {
          reject();
        }
      });
  };

export const onChange = (newValue, e) => {
  console.log('code in editor changed');
};
