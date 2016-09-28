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
      '/login': {
        target: 'http://candy.yuanoook.com',
        onProxyReq(proxyReq, req, res) {
          proxyReq.setHeader('host', 'candy.yuanoook.com')
          proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1')
        }
      },
      '/*.html': {
        target: 'http://candy.yuanoook.com',
        onProxyReq(proxyReq, req, res) {
          proxyReq.setHeader('host', 'candy.yuanoook.com')
          proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1')
        }
      }
    }
  }
}