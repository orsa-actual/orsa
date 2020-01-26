const { exec } = require('child-process-promise');

const DEFAULT_BUILD_COMMAND = 'npm install';
const DEFAULT_TEST_COMMAND = 'npm test';

module.exports = async (
  { javascriptBuildCommand, javascriptTestCommand }, { store, logger },
) => {
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

  for (const { id } of projects) {
    const project = store.getById(id);

    try {
      logger.log('Javascript builder', `Building ${project.name}`);
      const {
        stdout,
        stderr,
      } = await exec(
        javascriptBuildCommand || DEFAULT_BUILD_COMMAND, { cwd: project.transient.path },
      );
      store.update({
        ...project,
        build: {
          stdout,
          stderr,
        },
      });
    } catch (error) {
      logger.error('Javascript builder', `Error building ${project.name} - ${error.toString()}`);
      store.update({
        ...project,
        build: {
          error: error.toString(),
        },
      });
    }

    if (!project.build.error) {
      try {
        logger.log('Javascript builder', `Testing ${project.name}`);
        const {
          stdout,
          stderr,
        } = await exec(
          javascriptTestCommand || DEFAULT_TEST_COMMAND, { cwd: project.transient.path },
        );
        store.update({
          ...project,
          test: {
            stdout,
            stderr,
          },
        });
      } catch (error) {
        logger.error('Javascript builder', `Error testing ${project.name} - ${error.toString()}`);
        store.update({
          ...project,
          test: {
            error: error.toString(),
          },
        });
      }
    }
  }
};
