const childProcess = require('child_process');

module.exports = (wallaby) => {
  childProcess.spawnSync('rm', [
    '-fr',
    './fixtures/*/*/node_modules',
  ]);
  childProcess.spawnSync('cp', [
    '-r',
    './fixtures',
    `${wallaby.projectCacheDir}/fixtures`,
  ]);
  return {
    files: [
      'src/**/*.js',
      'index.js',
    ],
    tests: [
      'test/**/*.js',
    ],
    env: {
      type: 'node',
    },
  };
};
