var path = require("path")
var ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports = {
  entry: {
    app: ["whatwg-fetch", "./client/app/main"]
  },
  output: {
    path: path.resolve(__dirname, "client"),
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.jsx$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel'
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("[name].css")
  ],
  resolve: {
    extensions: ['', '.js', '.jsx', '.less'],
  }
}