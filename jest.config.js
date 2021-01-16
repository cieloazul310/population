module.exports = {
  verbose: true,
  projects: ['<rootDir>/packages/*'],
  testPathIgnorePatterns: [
    `<rootDir>/dist/`,
    `<rootDir>/node_modules/`,
  ],
  //transform: {
    //'^.+\\.(ts|tsx)$': 'ts-jest',
  //},
};
