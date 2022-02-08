module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-react'],
  targets: {
    node: 'current',
  },
  exclude: ["test", "release/build", "release/app/dist", ".erb/dll"]
};
