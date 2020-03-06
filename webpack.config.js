const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

const javascript = {
  test: /\.(js)$/, 
  exclude: /(node_modules|bower_components)/,
  use: [{
    loader: 'babel-loader',
    options: { presets: ['@babel/preset-env'] } 
  }],
};

const styles = {
  test: /\.s[ac]ss$/i,
  use: [
    // Creates `style` nodes from JS strings
    'style-loader',
    // Translates CSS into CommonJS
    {
      loader: 'css-loader',
      options: {
        sourceMap: true,
      },
    },
    // Compiles Sass to CSS
    {
      loader: 'sass-loader',
      options: {
        sourceMap: true,
      },
    },
  ],
};

const postcss = {
  loader: 'postcss-loader',
  options: {
    // plugins() { return [autoprefixer({ browsers: 'last 3 versions' })]; }
    plugins: [ require('autoprefixer') ]
  }
};

const fonts = {
  test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
  use: [{
    loader: 'file-loader',
    options: {
      name: '[name].[ext]',
      outputPath: 'fonts/'
    }
  }],
};

const config = {
  entry: {
    app: './public/javascripts/maintenance-log.js'
  },
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'public', 'dist'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [javascript, styles, fonts]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
};

process.noDeprecation = true;

module.exports = config;
