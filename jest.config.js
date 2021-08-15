module.exports = {
    setupFilesAfterEnv: [
        "./src/setupTests.js"
      ],
    transform: {
      "^.+\\.(js|jsx)$": "babel-jest",
    },
    moduleNameMapper:{
      "\\.(css|less|sass|scss)$": "<rootDir>/src/assets/__mocks__/styleMock.js",
      "\\.(gif|ttf|eot|svg)$": "<rootDir>/src/assets/__mocks__/fileMock.js"
 }
  };  