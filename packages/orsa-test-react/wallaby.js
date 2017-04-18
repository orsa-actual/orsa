const childProcess = require('child_process');

module.exports = (wallaby) => {
  /*
  Some nasty little hackery to get Wallaby, which runs instrumented projects
  in another directory, to find the test fixtures we need for our project.
  */
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
