const glob = require('glob');
const path = require('path');
const md5 = require('md5');
const fs = require('fs');
const docGen = require('react-docgen');

const astParser = require('../utilities/ast-parser');
const { runRules } = require('../rules');

const {
  runner,
  allMatchers,
  visit,
} = require('../javascript');

const LOCATIONS = [
  'src/**/*.js',
  'src/**/*.jsx',
  'index.js',
];
const IGNORE = [
  '**/*.test.js',
  '**/*.spec.js',
];
const JS_TYPE = 'text/javascript';

/* eslint-disable quotes */
const snipppetExtractor = (lines, start, end) => ((lines && start < lines.length)
  ? lines.slice(start - 1, end).join("\n") : '');
/* eslint-enable quotes */

module.exports = async (config, context, opts) => {
  const { javascriptPatterns, javascriptIgnore, javascriptMatchers } = config;
  const { store, logger } = context;
  const options = {
    glob,
    runner,
    fs,
    ...opts,
  };

  const matchers = javascriptMatchers || allMatchers;

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

    (javascriptPatterns || LOCATIONS).forEach((location) => {
      const files = options.glob.sync(location, {
        cwd: project.transient.path,
        ignore: (javascriptIgnore || IGNORE),
      });

      files.forEach((name) => {
        logger.log('Javascript scanner', `Processing ${project.name} : ${name} `);

        const localPath = path.join(project.transient.path, name);
        const { ast, lines } = astParser(localPath, options);

        const docgenOutput = [];
        try {
          const output = docGen.parse(fs.readFileSync(localPath).toString());
          if (output && output.props) {
            Object.keys(output.props).forEach((propName) => {
              docgenOutput.push(Object.assign(output.props[propName], {
                name,
              }));
            });
          }
        // eslint-disable-next-line no-empty
        } catch (docgenError) {
        }

        const file = {
          id: md5(`${project.name}:${project.version}:${localPath}`),
          parentId: id,
          nodeType: 'File',
          mimeType: JS_TYPE,
          relativePath: name,
          name,
          jsdoc: docgenOutput,
        };

        const found = options.runner(
          ast,
          matchers,
        );

        if (found.errors.length > 0) {
          logger.error('Javascript scanner', 'Found errors');
        }

        /* eslint-disable no-param-reassign */
        visit(found.features, (node) => {
          node.snippet = snipppetExtractor(
            lines,
            node.start,
            node.end,
          );
        });

        found.features.forEach((feature) => {
          feature.id = md5(`${id}:${file.id}:${feature.start}:${feature.end}:${feature.type}`);
          feature.parentId = file.id;
          (feature.methods || []).forEach((method) => {
            method.id = md5(`${feature.id}:${method.start}:${method.end}:${method.type}`);
            method.parentId = feature.id;
          });
        });
        /* eslint-enable no-param-reassign */

        file.features = found.features;

        runRules(config, context, 'File', {
          ...file,
          ast,
          project,
        });

        store.update(file);
      });
    });
  }
};
