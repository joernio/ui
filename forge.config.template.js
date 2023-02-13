module.exports = {
	packagerConfig: {
		asar: true,
	},
	plugins: [{name: '@electron-forge/plugin-auto-unpack-natives', config: {}}],
	makers: [
		{
			name: '@electron-forge/maker-squirrel',
			config: {
				name: 'ui-client',
			},
		},
		{
			name: '@electron-forge/maker-zip',
			platforms: ['darwin'],
		},
		{
			name: '@electron-forge/maker-deb',
			config: {
				icon: './dist/main/icon.png',
			},
		},
		{
			name: '@electron-forge/maker-rpm',
			config: {
				icon: './dist/main/icon.png',
			},
		},
	],
};
