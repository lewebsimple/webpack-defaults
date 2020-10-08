const { resolve } = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const postcssPresetEnv = require('postcss-preset-env');

const mode = process.argv.includes('production') ? 'production' : 'development';

const postcssOptions = {
  plugins: [
    postcssPresetEnv(),
  ],
};

module.exports = {

  mode,

  module: {
    rules: [

      // Fonts
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'file-loader',
        options: { name: 'fonts/[name].[ext]' },
      },

      // Images
      {
        test: /\.(gif|png|jpe?g|svg)$/,
        loader: 'file-loader',
        options: { name: 'images/[name].[ext]' },
      },

      // JavaScript
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime'],
          },
        },
      },

      // CSS
      {
        test: /\.css$/,
        use: [
          mode === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            loader: 'css-loader',
            options: { sourceMap: true, importLoaders: 1 },
          },
          {
            loader: 'postcss-loader',
            options: { sourceMap: true, postcssOptions },
          },
        ],
      },

    ]
  },

  plugins: [

    // Clean assets directory in production
    ...(mode === 'production' ? [new CleanWebpackPlugin()] : []),

    // Extract styles to a single CSS file
    new MiniCssExtractPlugin({ filename: 'css/[name].css', }),

  ],

  resolveLoader: {
    modules: ['node_modules', resolve(__dirname, 'node_modules')]
  },

  devtool: mode === 'development' ? 'source-map' : false,
  
  performance: { hints: false },
  
  stats: {
    all: false,
    assets: true,
    errors: true,
    timings: true,
    warnings: true,
  },

};
