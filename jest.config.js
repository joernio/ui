module.exports = {
  testURL: 'http://localhost/',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [
    './.erb/scripts/check-build-exists.js',
    './src/renderer/setupTests.js',
  ],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': '<rootDir>/.erb/mocks/styleMock.js',
    '\\.(gif|ttf|eot|svg|jpg|jpeg|png|otf|webp|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/.erb/mocks/fileMock.js',
    'monaco-editor':
      '<rootDir>/node_modules/monaco-editor/esm/vs/editor/editor.api.d.ts',
  },
  moduleFileExtensions: ['js', 'jsx', 'json'],
  moduleDirectories: ['node_modules', 'release/app/node_modules'],
  testPathIgnorePatterns: ['release/app/dist'],
};
