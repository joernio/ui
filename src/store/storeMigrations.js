const migrations = {
  0: state => {
    return {
      state,
      settings: {
        ...state.settings,
        queryShortcuts: {},
      },
    };
  },
};

export default migrations;
