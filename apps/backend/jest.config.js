export default {
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'json', 'node'],
  "testPathIgnorePatterns": ["/node_modules/"]
};
