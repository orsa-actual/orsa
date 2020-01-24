const { graphql, buildSchema } = require('graphql');
const { addResolveFunctionsToSchema } = require('graphql-tools');
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const rimraf = require('rimraf');

// eslint-disable-next-line operator-linebreak
const SCHEMA =
`type Method {
  feature: Feature!
  start: Int!
  end: Int!
  type: String!
  kind: String
  snippet: String
}

type Feature {
  id: ID!
  file: File!
  start: Int!
  end: Int!
  type: String!
  name: String
  from: String
  keys: [String!]
  attributes: [String!]
  methods: [Method!]
  snippet: String
}

type JSDocValue {
  value: String
  computed: Boolean
}

type JSDocType {
  name: String
  value: [JSDocValue]
}

type JSDocItem {
  type: [JSDocType]
  name: String!
  required: Boolean
  description: String
  defualtValue: JSDocValue
}

type File {
  id: ID!
  project: Project!
  mimeType: String!
  relativePath: String!
  name: String!
  features: [Feature!]
  jsdoc: [JSDocItem!]
}

type RunResult {
  stdout: String
  stderr: String
  error: String
}

type Dependency {
  name: String!
  type: String!
  version: String
  requestedVersion: String
}

type Project {
  id: ID!
  name: String!
  version: String!
  packageJSON: String!
  projectType: String!
  files: [File!]
  build: RunResult
  test: RunResult
  dependencies: [Dependency!]
}

type Query {
  projects: [Project!]
  files: [File!]
  projectSearch(name: String): [Project!]
  featureSearch(type: String!, from: String, name: String): [Feature!]
}
`;

module.exports = {
  createStore: () => {
    const nodes = {};

    const schema = buildSchema(SCHEMA);

    const resolvers = {
      Project: {
        files: ({ id }) => Object.values(nodes).filter(({ nodeType, parentId }) => nodeType === 'File' && parentId === id),
      },
      File: {
        project: ({ parentId }) => nodes[parentId],
      },
      Method: {
        feature: ({ parentId }) => nodes[parentId],
      },
      Feature: {
        file: ({ parentId }) => nodes[parentId],
      },
      Query: {
        files: () => Object.values(nodes).filter(({ nodeType }) => nodeType === 'File'),
        projects: () => Object.values(nodes).filter(({ nodeType }) => nodeType === 'Project'),
        projectSearch: (obj, args) => {
          const searchName = args.name.toLowerCase();
          return Object.values(nodes).filter(
            ({ nodeType, name }) => nodeType === 'Project' && name.toLowerCase().indexOf(searchName) > -1,
          );
        },
        featureSearch: (obj, args) => {
          const features = [];
          Object.values(nodes)
            .filter(({ nodeType }) => nodeType === 'File')
            .forEach((file) => {
              file.features
                .filter(({ type, from, name }) => {
                  if (type !== args.type) {
                    return false;
                  }
                  if (args.name && name !== args.name) {
                    return false;
                  }
                  if (args.from && from !== args.from) {
                    return false;
                  }
                  return true;
                })
                .forEach((f) => features.push(f));
            });
          return features;
        },
      },
    };
    addResolveFunctionsToSchema({
      schema,
      resolvers,
    });

    const root = {};
    return {
      update: (node) => {
        nodes[node.id] = Object.assign(nodes[node.id] || {}, node);
      },
      getById: (id) => nodes[id],
      query: async (gql) => graphql(schema, gql, root),
      load: async ({ basePath, storeDirectory = '.orsa-data' }) => {
        glob
          .sync(path.join(basePath, storeDirectory, '*.json'))
          .forEach((p) => {
            nodes[path.basename(p, '.json')] = JSON.parse(fs.readFileSync(p).toString());
          });
        return {
          typeDefs: SCHEMA,
          resolvers,
        };
      },
      save: async ({ basePath, storeDirectory = '.orsa-data' }) => {
        rimraf.sync(path.join(basePath, storeDirectory));
        fs.mkdirSync(path.join(basePath, storeDirectory));
        Object
          .keys(nodes)
          .forEach((k) => {
            fs.writeFileSync(
              path.join(basePath, storeDirectory, `${k}.json`),
              JSON.stringify({
                ...nodes[k],
                transient: undefined,
              }, null, 2),
            );
          });
      },
    };
  },
};
