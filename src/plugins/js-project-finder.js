const fs = require('fs');
const path = require('path');
const md5 = require('md5');

const findPackageJSON = (absPath, { store, logger, subPath }, options) => {
  const packageLocation = path.join(absPath, 'package.json');
  if (options.fs.existsSync(packageLocation)) {
    const packageJSON = JSON.parse(options.fs.readFileSync(packageLocation).toString());
    if (packageJSON) {
      logger.log('Project Finder', `Found project in ${subPath}`);
      store.update({
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
      });
    }
  }
};

module.exports = ({ scanDirectories }, { basePath, store, logger }, opts = {}) => {
  const options = {
    fs,
    ...opts,
  };
  for (const dir of scanDirectories) {
    for (const subPath of fs.readdirSync(path.join(basePath, dir))) {
      findPackageJSON(path.join(basePath, dir, subPath), { store, logger, subPath }, options);
    }
  }
};
