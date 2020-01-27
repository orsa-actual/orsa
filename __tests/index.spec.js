const { ApolloServer, gql } = require('apollo-server-express');
const rimraf = require('rimraf');
const express = require('express');
const store = require('../src/store');
const index = require('../src/index');

jest.mock('../src/store');
jest.mock('apollo-server-express');
jest.mock('rimraf');
jest.mock('express');

describe('Main', () => {
  beforeEach(() => {
    rimraf.sync.mockImplementation(() => {});
  });
 
  it('should scan', async () => {
    store.createStore.mockImplementation(() => ({
      load: () => ({}),
      save: () => {},
    }));
    index.scan({}, {
      logger: {
        log: () => {},
      },
    });
    index.scan({
      projectScanPlugins: [
        () => {},
      ],
    }, {
      logger: {
        log: () => {},
      },
    });
  });
  it('should serve', async () => {
    store.createStore.mockImplementation(() => ({
      load: () => ({}),
      save: () => {},
    }));
    express.mockImplementation(() => ({
      applyMiddleware: () => {},
      listen: () => {},
    }));
    ApolloServer.mockImplementation(function() {
      return this;
    });
    index.serve({}, {
      logger: {
        log: () => {},
      },
    });
  });
});
