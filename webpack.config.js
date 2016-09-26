var path = require("path");
module.exports = {
  entry: {
    app: ["./client/app/main"]
  },
  output: {
    path: path.resolve(__dirname, "client"),
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.jsx$/,
        loader: 'babel',
        query: {
          presets: ['es2015','react']
        }
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  }
};