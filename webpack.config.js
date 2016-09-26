var path = require("path");
module.exports = {
  entry: {
    app: ["./client/app/main.js"]
  },
  output: {
    path: path.resolve(__dirname, "client"),
    filename: "bundle.js"
  }
};