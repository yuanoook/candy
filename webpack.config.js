var path = require("path")

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
        loader: "style!css!less"
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.less'],
  },
  devServer: {
    proxy: {
      '/(login|logout|post|register)': {
        target: 'https://candy.yuanoook.com',
        secure: false,
        onProxyReq(proxyReq, req, res) {
          proxyReq.setHeader('host', 'candy.yuanoook.com')
        }
      }
    }
  }
}