const Dotenv = require("dotenv-webpack");
const webpack = require("webpack");

console.log(process.env.HOLODEX_API_KEY);

module.exports = {
  entry: "./src/index.js",
  plugins: [
    new webpack.DefinePlugin({
      "process.env.FLUENTFFMPEG_COV": false,
    }),
    // new Dotenv(),
    // new webpack.EnvironmentPlugin({ HOLODEX_API_KEY: process.env.HOLODEX_API_KEY }),
  ],
  externals: {
    sharp: "sharp",
  },
  module: {
    rules: require("./webpack.rules"),
  },
  target: "electron-main",
  // resolve: {
  //   extensions: [".js"],
  //   mainFields: ["main"],
  // },
  // resolve: {
  //   alias: {
  //     "./lib-cov/fluent-ffmpeg": "./lib/fluent-ffmpeg",
  //   },
  // },
};
