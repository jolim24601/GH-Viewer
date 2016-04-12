var path = require('path');
var webpack = require('webpack');
var env = require('./.env');
var precss = require('precss');
var autoprefixer = require('autoprefixer');

module.exports = {
  devtool: 'inline-source-map',
  entry: [
    'webpack-hot-middleware/client',
    './src/index.js'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': Object.keys(env).reduce(function(o, k) {
        o[k] = JSON.stringify(env[k]);
        return o;
      }, {})
    })
  ],
  module: {
    noParse: [/autoit\.js$/],
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/
      },
      {
        test:   /\.css$/,
        loader: 'style-loader!css-loader!postcss-loader'
      }
    ]
  },
  postcss: function () {
      return [precss, autoprefixer];
  }
};
