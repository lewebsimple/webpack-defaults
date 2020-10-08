const mode = process.argv.includes('production') ? 'production' : 'development';

module.exports = {

  mode,

  module: {
    rules: [
      // Scripts
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
      }
    ]
  },

  plugins: [

    // Clean assets directory in production
    ...(mode === 'production' ? [new CleanWebpackPlugin()] : []),

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
