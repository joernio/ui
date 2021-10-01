module.exports = {
  packagerConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'ui_client',
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        icon: './src/assets/image/icon.png',
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {
        icon: './src/assets/image/icon.png',
      },
    },
  ],
};
