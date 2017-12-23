const path = require('path');

module.exports = {
  entry: './js/src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'js', 'dist')
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
    ]
  }
};
