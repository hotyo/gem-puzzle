const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, options) => {
  const isProduction = options.mode === 'production';

  const config = {
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? 'none' : 'source-map',
    watch: !isProduction,
    context: path.join(__dirname, 'src'),
    entry: [
      './scripts/index.js', 
      // '.src/styles/style.scss'
    ],
    output: {
      filename: 'bundle.js',
      path: path.join(__dirname, '/dist'),
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: [["@babel/plugin-proposal-class-properties", { "loose": true }]]
            },
          },
        }, {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader',
          ],
        }, {
          test: /\.(png|svg|jpe?g|gif|ttf)$/,
          use: {
            loader: 'file-loader',
          },
        }, {
          test: /\.html$/,
          use: {
            loader: 'html-loader',
          },
        },
      ],
    },

    plugins: [
      isProduction ? new CleanWebpackPlugin() : () => {},
      new HtmlWebpackPlugin({
        favicon: './assets/images/favicon.ico',
        template: './templates/index.html',
      }),
      new MiniCssExtractPlugin({
        filename: 'style.css',
      }),
    ],
  };

  return config;
};
