const { resolve } = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const postcssPresetEnv = require('postcss-preset-env');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

const mode = process.argv.includes('production') ? 'production' : 'development';

module.exports = {

  mode,

  module: {
    rules: [

      // JavaScript
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: ['@babel/plugin-transform-runtime'],
        },
      },

      // TypeScript
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
        options: { appendTsSuffixTo: [/\.vue$/] },
      },

      // Vue.js
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },

      // CSS / SCSS
      {
        test: /\.(css|scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { sourceMap: true, importLoaders: 1 },
          },
          {
            loader: 'postcss-loader',
            options: { sourceMap: true },
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
        test: /\.(eot|ttf|woff|woff2)$/,
        loader: 'file-loader',
        options: { name: 'fonts/[name].[ext]' },
      },

      // Images
      {
        test: /\.(gif|png|jpe?g)$/,
        loader: 'file-loader',
        options: { name: 'images/[name].[ext]' },
      },

      // SVG
      {
        test: /\.svg$/,
        oneOf: [
          {
            resourceQuery: /inline/,
            use: [
              'babel-loader',
              'vue-svg-loader',
            ],
          },
          {
            loader: 'file-loader',
            query: {
              name: 'assets/[name].[hash:8].[ext]',
            },
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

    // Vue.js
    new VueLoaderPlugin(),

    // BrowserSync
    ...(process.env.PROXY_HOST ? [new BrowserSyncPlugin({
      host: 'localhost',
      port: process.env.PROXY_PORT || 3000,
      proxy: process.env.PROXY_HOST,
      notify: false,
      files: ['*.php', 'templates/**/*.php'],
    })] : []),

  ],

  resolve: {
    extensions: ['.ts', '.js']
  },

  resolveLoader: {
    modules: ['node_modules', resolve(__dirname, 'node_modules')]
  },

  devtool: mode === 'development' ? 'source-map' : false,

  optimization: {
    minimizer: [
      new TerserPlugin({ extractComments: (astNode, comment) => false }),
      new OptimizeCssAssetsPlugin()
    ]
  },

  performance: { hints: false },

  stats: {
    all: false,
    assets: true,
    errors: true,
    timings: true,
    warnings: true,
  },

};
