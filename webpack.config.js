const { resolve } = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const postcssPresetEnv = require('postcss-preset-env');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

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

      // JavaScript
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime'],
          },
        },
      },

      // TypeScript
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
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

      // SCSS
      {
        test: /\.scss$/,
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
          {
            loader: 'resolve-url-loader',
            options: { sourceMap: true },
          },
          {
            loader: 'sass-loader',
            options: { sourceMap: true },
          },
        ],
      },

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
      
    ]
  },

  plugins: [

    // Clean assets directory in production
    ...(mode === 'production' ? [new CleanWebpackPlugin()] : []),

    // Extract styles to a single CSS file
    new MiniCssExtractPlugin({ filename: 'css/[name].css', }),

    // BrowserSync
    ...(process.env.PROXY_HOST ? [new BrowserSyncPlugin({
      host: 'localhost',
      port: process.env.PROXY_PORT || 3000,
      proxy: process.env.PROXY_HOST,
      notify: false,
      files: ['*.php', 'templates/**/*.php'],
    })] : []),

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
