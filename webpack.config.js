const path = require('path')
const webpack = require('webpack')
// creates a separate style.css file after sass -> css -> post processing
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// automatically removes extra webpack-generated dev files
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const javascript = {
  test: /\.(js)$/, 
  exclude: /(node_modules|tests)/ig,
  use: {
    loader: 'babel-loader',
    options: { 
      presets: ['@babel/preset-env'] 
    } 
  },
}

const styles = {
  test: /\.(scss)$/,
  use: [
    {
      loader: MiniCssExtractPlugin.loader
    },
    'css-loader',
    'postcss-loader',
    'sass-loader',
  ],
}

const icons = {
  test: /\.(svg)$/,
  use: [
    {
      loader: 'file-loader',
      options: {
        outputPath: 'images/icons/'
      }
    }
  ]
}

const images = {
  test: /\.(png|jpe?g|gif)$/,
  use: [
    {
      loader: 'file-loader',
      options: {
        outputPath: 'images/'
      }
    }
  ]
}

const fonts = {
  test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
  use: [{
    loader: 'file-loader',
    options: {
      name: '[name].[ext]',
      outputPath: '../fonts/'
    }
  }],
}

const config = {
  entry: {
    app: './public/javascripts/maintenance-log.js'
  },
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'public', 'dist'),
    filename: 'App.bundle.js'
  },
  module: {
    rules: [javascript, styles, fonts, icons, images]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "style.css"
    })
  ],
  mode: 'development'
}

module.exports = config
