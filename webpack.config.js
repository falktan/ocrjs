const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/main.js',
  mode: 'development',
  module: {
    rules: [
      { test: /\.css$/i, use: ['style-loader', 'css-loader'] },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      }
    ]
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'serve', 'dist'),
    clean: true
  },
  plugins: [
    new HtmlWebpackPlugin()
  ]
};