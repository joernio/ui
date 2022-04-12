export const defaults = {
  windowPosition: [-1, -1],
  windowSize: [1300, 950],
};

export const getWindowPosition = () => {
  const size = defaults.windowSize;

  let position = defaults.windowPosition;

  return { position, size };
};
