const defaults = {
  windowPosition: [-1, -1],
  windowSize: [1300, 950],
};

const getWindowPosition = () => {
  const size = defaults.windowSize;

  let position = defaults.windowPosition;

  return { position, size };
};

module.exports = { getWindowPosition, defaults };
