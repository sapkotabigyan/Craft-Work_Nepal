module.exports = {
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".js"],
  transform: {},

  // Helps avoid path issues with relative imports ending in .js
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};
