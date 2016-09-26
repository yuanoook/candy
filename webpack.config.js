var path = require("path");
module.exports = {
  entry: {
    app: ["./client/app/main.js"]
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
        loader: 'babel', // 'babel-loader' is also a valid name to reference
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
};