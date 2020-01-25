const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

const {
  createStore,
} = require('./store');

const runPlugins = async (plugins, config, context) => {
  for (const plugin of plugins) {
    await plugin(config, context);
  }
};

const core = {
  scan: async (config, context = {}) => {
    // eslint-disable-next-line no-param-reassign
    context.store = createStore();

    context.logger.log('Orsa', 'Running project scanning plugins');
    await runPlugins(config.projectScanPlugins || [], config, context);

    context.logger.log('Orsa', 'Running project build plugins');
    await runPlugins(config.buildPlugins || [], config, context);

    context.logger.log('Orsa', 'Running file scanning plugins');
    await runPlugins(config.fileScanPlugins || [], config, context);

    context.logger.log('Orsa', 'Running analysis plugins');
    await runPlugins(config.analysisPlugins || [], config, context);

    context.logger.log('Orsa', 'Running plugins');
    await runPlugins(config.plugins || [], config, context);

    context.logger.log('Orsa', 'Saving data');
    context.store.save(context);
  },
  serve: async (config, context = {}) => {
    // eslint-disable-next-line no-param-reassign
    context.store = createStore();

    const { typeDefs, resolvers } = await context.store.load(context);

    const server = new ApolloServer({ typeDefs: gql`${typeDefs}`, resolvers });

    const app = express();
    server.applyMiddleware({ app });

    const port = process.env.PORT || 4000;
    // eslint-disable-next-line no-console
    app.listen({ port }, () => console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`));
  },
};

module.exports = core;
