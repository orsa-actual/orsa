const glob = require('glob');
const fs = require('fs');
const rimraf = require('rimraf');
const {
  createStore,
} = require('../../src/store');

jest.mock('glob');
jest.mock('fs');
jest.mock('rimraf');

describe('store', () => {
  beforeEach(() => {
    rimraf.sync.mockImplementation(() => {});
  });

  it('should update', async () => {
    const store = createStore();
    store.update({
      id: 'foo',
      nodeType: 'Project',
      bar: 1,
      name: 'foo',
    });
    expect(store.getById('foo').bar).toEqual(1);
    expect(await store.query(`{
      projects {
        id
      }
    }`)).toEqual({
      data: {
        projects: [
          {
            id: 'foo',
          },
        ],
      },
    });
    expect(await store.query(`{
      projectSearch(name: "foo") {
        id
      }
    }`)).toEqual({
      data: {
        projectSearch: [
          {
            id: 'foo',
          },
        ],
      },
    });
  });

  it('should add warnings', async () => {
    const store = createStore();
    store.addWarning({
      severity: 'high',
      messag: 'bar',
    });
    expect(await store.query(`{
      runInfo {
        warnings {
          project {
            name
          }
          file {
            name
          }
          severity
        }
      }
    }
  `)).toEqual({
      data: {
        runInfo: {
          warnings: [
            {
              file: null,
              project: null,
              severity: 'high',
            },
          ],
        },
      },
    });
  });

  it('should handle indexes', async () => {
    const store = createStore();
    store.update({
      id: 'foo',
      nodeType: 'Project',
      bar: 1,
      name: 'foo',
    });
    store.updateIndex('js-package-index', {
      foo: {
        name: 'foo',
        versions: [
          {
            name: 'foo',
            version: '1.0.0',
            projects: [
              {
                project: 'foo',
              },
            ],
          },
        ],
      },
    });
    expect(await store.query(`{
      dependencySearch(name: "foo") {
        name
        versions {
          name
          projects {
            project {
              name
            }
          }
        }
      }
    }
    `)).toEqual({
      data: {
        dependencySearch: [
          {
            name: 'foo',
            versions: [
              {
                name: 'foo',
                projects: [
                  {
                    project: {
                      name: 'foo',
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    });
  });

  it('should load', () => {
    glob.sync.mockImplementation(() => (['1.json']));
    fs.readFileSync.mockImplementation(() => JSON.stringify({ id: '1' }));
    const store = createStore();
    store.load({
      basePath: '/tmp',
    });
  });

  it('should save', () => {
    rimraf.sync.mockImplementation(() => {});
    fs.mkdirSync.mockImplementation(() => {});
    fs.writeFileSync.mockImplementation(() => JSON.stringify({ id: '1' }));
    const store = createStore();
    store.updateIndex('foo', []);
    store.update({
      id: 'foo',
      nodeType: 'Project',
      bar: 1,
    });
    store.save({
      basePath: '/tmp',
    });
  });

  it('should handle project files', async () => {
    const store = createStore();
    store.update({
      id: 'foo',
      nodeType: 'Project',
      bar: 1,
      name: 'foo',
    });
    store.update({
      id: 'foo2',
      parentId: 'foo',
      nodeType: 'File',
      name: 'foo2',
      bar: 1,
      features: [
        {
          type: 'jsx-usage',
          id: 'feature1',
          parentId: 'foo2',
          name: 'foobaz',
          methods: [
            {
              id: 'method1',
              parentId: 'feature1',
              snippet: 'hi',
            },
          ],
        },
      ],
    });
    expect(store.getById('foo').bar).toEqual(1);
    expect(await store.query(`{
      projects {
        id
        files {
          name
        }
      }
    }`)).toEqual({
      data: {
        projects: [
          {
            id: 'foo',
            files: [
              {
                name: 'foo2',
              },
            ],
          },
        ],
      },
    });

    expect(await store.query(`{
      files {
        id
        project {
          name
        }
        features {
          file {
            name
          }
          methods {
            snippet
          }
          name
        }
      }
    }`)).toEqual({
      data: {
        files: [
          {
            id: 'foo2',
            project: {
              name: 'foo',
            },
            features: [
              {
                file: {
                  name: 'foo2',
                },
                methods: [
                  {
                    snippet: 'hi',
                  },
                ],
                name: 'foobaz',
              },
            ],
          },
        ],
      },
    });

    expect(await store.query(`{
      files {
        id
      }
    }`)).toEqual({
      data: {
        files: [
          {
            id: 'foo2',
          },
        ],
      },
    });
  });

  it('should handle feature search', async () => {
    const store = createStore();
    store.update({
      id: 'foo',
      nodeType: 'Project',
      bar: 1,
      name: 'foo',
    });
    store.update({
      id: 'foo2',
      parentId: 'foo',
      nodeType: 'File',
      name: 'foo2',
      bar: 1,
      features: [
        {
          type: 'jsx-usage',
          id: 'feature1',
          parentId: 'foo2',
          name: 'foobaz',
          from: 'import-name',
          methods: [
            {
              id: 'method1',
              parentId: 'feature1',
              snippet: 'hi',
            },
          ],
        },
        {
          type: 'not-jsx-usage',
          id: 'feature1',
          parentId: 'foo2',
          name: 'foobaz',
          methods: [
            {
              id: 'method1',
              parentId: 'feature1',
              snippet: 'hi',
            },
          ],
        },
      ],
    });

    expect(await store.query(`{
      featureSearch(type: "jsx-usage") {
        id
      }
    }`)).toEqual({
      data: {
        featureSearch: [
          {
            id: 'feature1',
          },
        ],
      },
    });

    expect(await store.query(`{
      featureSearch(type: "jsx-usage", from: "bar", name: "baz") {
        id
      }
    }`)).toEqual({
      data: {
        featureSearch: [
        ],
      },
    });

    expect(await store.query(`{
      featureSearch(type: "jsx-usage", from: "import-name", name: "foobaz") {
        id
      }
    }`)).toEqual({
      data: {
        featureSearch: [
          {
            id: 'feature1',
          },
        ],
      },
    });

    expect(await store.query(`{
      featureSearch(type: "jsx-usage", from: "yall", name: "foobaz") {
        id
      }
    }`)).toEqual({
      data: {
        featureSearch: [
        ],
      },
    });
  });
});
