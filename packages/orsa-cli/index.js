const program = require('commander');
const fs = require('fs');
const path = require('path');
const assign = require('lodash.assign');

const Orsa = require('orsa-core');

module.exports = (opts) => {
  const options = assign({
    console,
    process,
    Orsa,
    program,
    fs,
  }, opts);

  const version = JSON.parse(
    options.fs.readFileSync(
      path.resolve(__dirname, 'package.json')
    )
  ).version;

  options.program
    .version(version)
    .option('-p, --path [path]', 'Projects directory path')
    .option('-o, --output [path]', 'Report output path')
    .parse(process.argv);

  let exitStatus = 0;

  if (!options.program.path) {
    options.console.log('No path specified');
    exitStatus = 1;
  }

  if (exitStatus === 0) {
    const oc = new options.Orsa({
      plugins: [
        require('orsa-project-fs-scanner-plugin'),
        require('orsa-js-project-plugin'),
        require('orsa-js-language-plugin'),
        require('orsa-js-build-plugin'),
        require('orsa-js-dependency-plugin'),
        require('orsa-logger-bunyan-plugin'),
      ],
      'orsa-project-fs-scanner-plugin': {
        path: path.resolve(options.program.path),
      },
    });
    oc.run(() => {
      if (options.program.output) {
        fs.writeFileSync(options.program.output,
          JSON.stringify(oc.toObject(), null, 2));
      }
      options.process.exit(exitStatus);
    });
  } else {
    options.process.exit(exitStatus);
  }
};
