/* eslint-disable-next-line no-empty-pattern */
module.exports = async ({}, { store, logger }) => {
  logger.log('JS Package Indexer', 'Indexing pacakges');

  /* eslint-disable indent, comma-dangle */
  const { data: { projects } } = await store.query(
`query {
  projects {
    id
  }
}
`
  );
  /* eslint-enable indent, comma-dangle */

  const packages = {};
  for (const { id } of projects) {
    const project = store.getById(id);
    project.dependencies.forEach(({
      name, version, requestedVersion, type,
    }) => {
      if (packages[name] === undefined) {
        packages[name] = {
          name,
          requestedVersions: {},
          versions: {},
        };
      }

      // Version is only available if we've done a build
      if (version) {
        if (packages[name].versions[version] === undefined) {
          packages[name].versions[version] = {
            name,
            version,
            projects: [],
          };
        }
        packages[name].versions[version].projects.push({
          project: project.id,
          version: project.version,
          type,
        });
      }

      if (packages[name].requestedVersions[requestedVersion] === undefined) {
        packages[name].requestedVersions[requestedVersion] = {
          name,
          version: requestedVersion,
          projects: [],
        };
      }
      packages[name].requestedVersions[requestedVersion].projects.push({
        project: project.id,
        version: project.version,
        type,
      });
    });
  }

  Object.keys(packages).forEach((k) => {
    packages[k].requestedVersions = Object.values(packages[k].requestedVersions);
    packages[k].versions = Object.values(packages[k].versions);
  });

  store.updateIndex('js-package-index', packages);
};
