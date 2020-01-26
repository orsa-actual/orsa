const glob = require('glob');
const path = require('path');
const fs = require('fs');

/* eslint-disable-next-line no-empty-pattern */
module.exports = async ({}, { store, logger }) => {
  /* eslint-disable indent */
  const { data: { projects } } = await store.query(
`query {
  projects {
    id
  }
}`,
  );
  /* eslint-enable indent */

  for (const { id } of projects) {
    const project = store.getById(id);
    logger.log('Dependency Analysis', `${project.name}`);

    const packages = {};

    const dependencies = project.transient.packageJSON.dependencies || {};
    Object.keys(dependencies).forEach((name) => {
      packages[name] = { name, requestedVersion: dependencies[name], type: 'direct' };
    });

    const devDependencies = project.transient.packageJSON.devDependencies || {};
    Object.keys(devDependencies).forEach((name) => {
      packages[name] = { name, requestedVersion: devDependencies[name], type: 'dev' };
    });

    const peerDependencies = project.transient.packageJSON.peerDependencies || {};
    Object.keys(peerDependencies).forEach((name) => {
      packages[name] = { name, requestedVersion: peerDependencies[name], type: 'peer' };
    });

    logger.log('Dependency Analysis', `Scanning node modules on ${project.name}`);
    glob.sync('./node_modules/*/package.json', {
      cwd: project.transient.path,
    }).forEach((file) => {
      try {
        const pkg = JSON.parse(
          fs.readFileSync(path.resolve(project.transient.path, file)).toString(),
        );
        if (packages[pkg.name]) {
          packages[pkg.name].version = pkg.version;
        } else {
          packages[pkg.name] = {
            name: pkg.name,
            version: pkg.version,
            type: 'indirect',
          };
        }
      } catch (error) {
        logger.error('Dependency Analysis', `Couldn't parse ${file} - ${error.toString()}`);
      }
    });

    store.update({
      ...project,
      dependencies: Object.values(packages),
    });
  }
};
