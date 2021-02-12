module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    "plugins": [
      ["transform-inline-environment-variables", {
        "include": [
          "NODE_ENV",
          "REACT_NATIVE_BASE_URL",
          "REACT_NATIVE_GOOGLE_MAPS_API_KEY",
          "REACT_NATIVE_API_KEY",
        ]
      }]
    ],
  };
};
