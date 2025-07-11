// Learn more https://docs.expo.io/guides/customizing-metro
// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.transformer = {
  ...config.transformer,
  experimentalImportSupport: false,
  unstable_allowRequireContext: true,
};

config.resolver.assetExts.push("wasm");

module.exports = config;
