module.exports = function (api) {
  api.cache(true);
  // return {
  //   presets: [],
  // };

  const presets = [["babel-preset-expo"]];

  return {
    presets,
  };
};
