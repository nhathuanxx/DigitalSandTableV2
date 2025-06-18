module.exports = (api) => {
  const babelEnv = api.env();
  const plugins = [];
  //change to 'production' to check if this is working in 'development' mode
  if (babelEnv !== "development") {
    plugins.push(["transform-remove-console", { exclude: ["error", "warn"] }]);
  }
  plugins.push([
    "module-resolver",
    {
      root: ["."],
      alias: {
        '@app': './app',
        "@app/config": "./app/config",
        "@app/libs": "./app/libs",
        "@app/service": "./app/service",
        "@app/storage": "./app/storage",
        "@app/modules": "./app/modules",
        "@app/assets": "./app/assets",
        "@app/i18n": "./app/i18n",
        "@app/theme": "./app/theme",
        "@app/hooks": "./app/hooks",
        "@app/navigation": "./app/navigation",

      },
    },
  ]);
  return {
    presets: ["module:metro-react-native-babel-preset"],
    plugins: [
      ...plugins,
      'react-native-reanimated/plugin',
    ],
  };
};
