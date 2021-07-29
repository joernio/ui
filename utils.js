const { clipboard } = require('electron');

const handleClipBoardActivity = (type, value) => {
  if (type === 'copy') {
    clipboard.writeText(value);
  } else if (type === 'paste') {
    return clipboard.readText();
  }
};

module.exports = { handleClipBoardActivity };
