const fs = require('fs');
const path = require('path');
const md5 = require('md5');
const glob = require('glob');

const { runRules } = require('../rules');

const findPackageJSON = (absPath, config, context) => {
  const { store, logger, subPath } = context;
  const packageLocation = path.join(absPath, 'package.json');
  if (fs.existsSync(packageLocation)) {
    const packageJSON = JSON.parse(fs.readFileSync(packageLocation).toString());
    if (packageJSON) {
      logger.log('Project Finder', `Found ${packageJSON.name} in ${subPath}`);

      const project = {
        id: md5(`${packageJSON.name}:${packageJSON.version}`),
        nodeType: 'Project',
        name: packageJSON.name,
        version: packageJSON.version,
        packageJSON: JSON.stringify(packageJSON),
        projectType: 'node',
        transient: {
          path: absPath,
          packageJSON,
        },
      };

      store.update(project);

      runRules(config, context, 'Project', project);
    }
  }
};

const findLerna = (absPath, config, context) => {
  const { logger, subPath } = context;
  const lernaLocation = path.join(absPath, 'lerna.json');
  if (fs.existsSync(lernaLocation)) {
    const lernaJSON = JSON.parse(fs.readFileSync(lernaLocation).toString());
    if (lernaJSON) {
      logger.log('Project Finder', `Found lerna in ${subPath}`);
      (lernaJSON.packages || ['packages/*']).forEach((pattern) => {
        glob
          .sync(pattern, { cwd: absPath })
          .forEach((dir) => {
            const newPath = path.join(absPath, dir);
            findPackageJSON(newPath, config, context);
          });
      });
    }
  }
};

module.exports = (config, context) => {
  const { scanDirectories } = config;
  const { basePath } = context;
  for (const dir of scanDirectories) {
    for (const subPath of fs.readdirSync(path.join(basePath, dir))) {
      findPackageJSON(path.join(basePath, dir, subPath), config, { ...context, subPath });
      findLerna(path.join(basePath, dir, subPath), config, { ...context, subPath });
    }
  }
};
