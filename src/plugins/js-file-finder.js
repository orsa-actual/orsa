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
const TS_LOCATIONS = [
  'src/**/*.ts',
  'src/**/*.tsx',
  'index.ts',
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

module.exports = async (config, context) => {
  const {
    javascriptPatterns,
    javascriptIgnore,
    javascriptMatchers,
    typescriptPatterns,
  } = config;
  const { store, logger } = context;

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

    let files = [];
    (javascriptPatterns || LOCATIONS).forEach((location) => {
      files = [
        ...files,
        ...glob.sync(location, {
          cwd: project.transient.path,
          ignore: (javascriptIgnore || IGNORE),
        }),
      ];
    });
    let tsFiles = [];
    (typescriptPatterns || TS_LOCATIONS).forEach((location) => {
      tsFiles = [
        ...tsFiles,
        ...glob.sync(location, {
          cwd: project.transient.path,
          ignore: (javascriptIgnore || IGNORE),
        }),
      ];
    });

    logger.log('Javascript scanner', `Processing ${files.length} files in ${project.name}`);
    if (tsFiles.length > 0) {
      logger.log('Javascript scanner', `Found ${tsFiles.length} Typescript files in ${project.name}`);
    }
    files.forEach((name) => {
      const localPath = path.join(project.transient.path, name);
      const { ast, lines } = astParser(localPath);

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

      const found = runner(
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
  }
};
