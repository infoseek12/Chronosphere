const path = require('path');
const webpack = require('webpack');
const MiniCssExtractor = require('mini-css-extract-plugin');
const Prettyfy = require('prettier-webpack-plugin');

module.exports = {
  entry: {
    main: './src/sphere.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'sphere.js'
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
        use: {
          loader: 'file-loader'
        }
      },
      {
        test: /\.js/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractor.loader, 'css-loader', 'postcss-loader', 'sass-loader']
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      moment: 'moment'
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/), // Ignore all locale files of moment.js
    new MiniCssExtractor({
      filename: 'style.css'
    }),
    new Prettyfy()
  ]
};
