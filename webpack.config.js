const mode = process.argv.includes('production') ? 'production' : 'development';
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

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
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { sourceMap: true },
          },
        ],
      },

    ]
  },

  plugins: [

    // Clean assets directory in production
    ...(mode === 'production' ? [new CleanWebpackPlugin()] : []),

    // Extract styles to a single CSS file
    new MiniCssExtractPlugin({ filename: 'css/styles.css' }),
    
  ],

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
