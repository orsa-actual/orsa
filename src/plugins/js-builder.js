const glob = require('glob');
const fs = require('fs');
const { exec } = require('child_process');

const DEFAULT_BUILD_COMMAND = 'npm install';
const DEFAULT_TEST_COMMAND = 'npm test';

module.exports = async (
  { javascriptBuildCommand, javascriptTestCommand }, { store, logger }, opts,
) => {
  const options = {
    glob,
    fs,
    exec,
    ...opts,
  };

  const execPromise = (cmd, execOpts) => new Promise((resolve, reject) => {
    options.exec(cmd, execOpts,
      (error, stdout, stderr) => {
        if (error) {
          reject(new Error(error));
        } else {
          resolve({ error, stdout, stderr });
        }
      });
  });

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
      } = await execPromise(
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
      logger.error('Javascript builder', `Error building ${project.name}`);
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
        } = await execPromise(
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
        logger.error('Javascript builder', `Error testing ${project.name}`);
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
