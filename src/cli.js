const yargs = require('yargs');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const orsa = require('./index');
const projectFinderPlugin = require('./plugins/js-project-finder');
const jsFileFinderPlugin = require('./plugins/js-file-finder');
const jsDependenciesPlugin = require('./plugins/js-dependencies');
const jsBuilderPlugin = require('./plugins/js-builder');
const jsPackageIndexer = require('./plugins/js-package-indexer');

module.exports = async (opts) => {
  const options = {
    console,
    process,
    yargs,
    fs,
    ...opts,
  };

  let config = {
    scanDirectories: [
      '.',
    ],
    projectScanPlugins: [
      projectFinderPlugin,
    ],
    fileScanPlugins: [
      jsFileFinderPlugin,
    ],
    analysisPlugins: [
      jsDependenciesPlugin,
    ],
    plugins: [
      jsPackageIndexer,
    ],
  };

  if (options.fs.existsSync('.orscarc')) {
    config = {
      ...config,
      ...JSON.parse(options.fs.readFileSync('orscarc')),
    };
  }
  if (options.fs.existsSync('.orscarc.js')) {
    /* eslint-disable global-require, import/no-unresolved */
    config = {
      ...config,
      ...require('.orscarc.js'),
    };
    /* eslint-enable global-require, import/no-unresolved */
  }

  const context = {
    basePath: options.process.cwd(),
    logger: {
      warn: (source, msg) => {
        console.log(`${chalk.green(source)}: ${chalk.yellow(msg)}`);
      },
      error: (source, msg) => {
        console.error(`${chalk.green(source)}: ${chalk.red(msg)}`);
      },
      log: (source, msg) => {
        console.log(`${chalk.green(source)}: ${msg}`);
      }
    }
  };

  options.yargs
    .command('serve', 'start the server', () => {}, async (argv) => {
      await orsa.serve(config, context);
    })
    .command('scan', 'scan the projects directory', () => {}, async (argv) => {
      if (argv.build) {
        config.buildPlugins = [
          jsBuilderPlugin,
        ];
      }
      await orsa.scan(config, context);
    })
    .option('build', {
      alias: 'b',
      type: 'boolean',
      description: 'Builds the projects during scan'
    })
    .option('verbose', {
      alias: 'v',
      type: 'boolean',
      description: 'Run with verbose logging'
    })
    .argv
};
