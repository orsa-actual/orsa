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
            severity
          }
        }
      }
  `)).toEqual({
      data: {
        runInfo: {
          warnings: [
            {
              severity: 'high',
            },
          ],
        },
      },
    });
  });

  it('should handle indexes', async () => {
    const store = createStore();
    store.updateIndex('foo', []);
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
});
