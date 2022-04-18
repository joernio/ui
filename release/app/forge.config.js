module.exports = {
	packagerConfig: {
		asar: true,
	},
	plugins: [['@electron-forge/plugin-auto-unpack-natives']],
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
				icon: '../../assets/icon.png',
			},
		},
		{
			name: '@electron-forge/maker-rpm',
			config: {
				icon: '../../assets/icon.png',
			},
		},
	],
};
