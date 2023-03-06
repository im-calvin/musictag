const Dotenv = require("dotenv-webpack");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  plugins: [
    new webpack.DefinePlugin({
      "process.env.FLUENTFFMPEG_COV": false,
    }),
    // new Dotenv(),
    // used to copy the sharp module since sharp is external
    new CopyPlugin({
      patterns: [
        {
          from: "./node_modules/sharp/",
          to: "./node_modules/sharp/", // still under node_modules directory so it could find this module
        },
        // sharp's dependencies
        {
          from: "./node_modules/semver/",
          to: "./node_modules/semver/",
        },
        {
          from: "./node_modules/detect-libc/",
          to: "./node_modules/detect-libc/",
        },
        {
          from: "./node_modules/color/",
          to: "./node_modules/color/",
        },
        {
          from: "./node_modules/node-addon-api/",
          to: "./node_modules/node-addon-api/",
        },
        {
          from: "./node_modules/simple-get/",
          to: "./node_modules/simple-get/",
        },
        {
          from: "./node_modules/tar-fs/",
          to: "./node_modules/tar-fs/",
        },
        {
          from: "./node_modules/tunnel-agent/",
          to: "./node_modules/tunnel-agent/",
        },
        {
          from: "./node_modules/prebuild-install/",
          to: "./node_modules/prebuild-install/",
        },
        // for color
        {
          from: "./node_modules/color-string/",
          to: "./node_modules/color-string/",
        },
        {
          from: "./node_modules/color-convert/",
          to: "./node_modules/color-convert/",
        },
        {
          from: "./node_modules/color-name/",
          to: "./node_modules/color-name/",
        },
        {
          from: "./node_modules/simple-swizzle/",
          to: "./node_modules/simple-swizzle/",
        },
        {
          from: "./node_modules/is-arrayish/",
          to: "./node_modules/is-arrayish/",
        },
        // for simple-get
        {
          from: "./node_modules/lru-cache/",
          to: "./node_modules/lru-cache/",
        },
        // for tar-fs
        {
          from: "./node_modules/chownr/",
          to: "./node_modules/chownr/",
        },
        {
          from: "./node_modules/mkdirp-classic/",
          to: "./node_modules/mkdirp-classic/",
        },
        {
          from: "./node_modules/pump/",
          to: "./node_modules/pump/",
        },
        {
          from: "./node_modules/tar-stream/",
          to: "./node_modules/tar-stream/",
        },
        {
          from: "./node_modules/end-of-stream/",
          to: "./node_modules/end-of-stream/",
        },
        {
          from: "./node_modules/once/",
          to: "./node_modules/once/",
        },
      ],
    }),
    // new webpack.EnvironmentPlugin({ HOLODEX_API_KEY: process.env.HOLODEX_API_KEY }),
  ],
  externals: {
    sharp: "commonjs sharp",
  },
  module: {
    rules: require("./webpack.rules"),
  },
  target: "electron-main",
};
