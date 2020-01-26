const fs = require('fs');
const glob = require('glob');
const jsDependencies = require('../../src/plugins/js-dependencies');

jest.mock('fs');
jest.mock('glob');

describe('Javascript dependencies', () => {
  it('should scan dependencies', async () => {
    glob.sync.mockReturnValue(['foo']);
    fs.readFileSync.mockReturnValue(JSON.stringify({
      name: 'fooz',
      version: '0.0.1',
    }));
    let obj = null;
    await jsDependencies({}, {
      store: {
        query: () => ({
          data: {
            projects: [
              { id: '1', name: 'bar' },
            ],
          },
        }),
        getById: () => ({
          transient: {
            path: 'bar',
            packageJSON: {
              dependencies: {
                foo: 'bar',
                fooz: 'baz',
              },
            },
          },
          build: { },
        }),
        update: (inputObj) => {
          obj = inputObj;
        },
      },
      logger: {
        log: () => {},
        error: () => {},
      },
    });
    expect(obj.dependencies).toEqual([
      {
        name: 'foo',
        requestedVersion: 'bar',
        type: 'direct',
      },
      {
        name: 'fooz',
        type: 'direct',
        version: '0.0.1',
        requestedVersion: 'baz',
      },
    ]);
  });

  it('should handle indirects', async () => {
    glob.sync.mockReturnValue(['indie']);
    fs.readFileSync.mockReturnValue(JSON.stringify({
      name: 'indie',
      version: '0.0.1',
    }));
    let obj = null;
    await jsDependencies({}, {
      store: {
        query: () => ({
          data: {
            projects: [
              { id: '1', name: 'bar' },
            ],
          },
        }),
        getById: () => ({
          transient: {
            path: 'bar',
            packageJSON: {
              devDependencies: {
                foo: 'bar',
              },
            },
          },
          build: { },
        }),
        update: (inputObj) => {
          obj = inputObj;
        },
      },
      logger: {
        log: () => {},
        error: () => {},
      },
    });
    expect(obj.dependencies).toEqual([
      {
        name: 'foo',
        requestedVersion: 'bar',
        type: 'dev',
      },
      {
        name: 'indie',
        type: 'indirect',
        version: '0.0.1',
      },
    ]);
  });

  it('should handle errors', async () => {
    glob.sync.mockReturnValue(['indie']);
    fs.readFileSync.mockReturnValue('blarg');
    await jsDependencies({}, {
      store: {
        query: () => ({
          data: {
            projects: [
              { id: '1', name: 'bar' },
            ],
          },
        }),
        getById: () => ({
          transient: {
            path: 'bar',
            packageJSON: {
              dependencies: {
                foo: 'bar',
              },
            },
          },
          build: { },
        }),
        update: () => {},
      },
      logger: {
        log: () => {},
        error: (err, info) => {
          expect(info.indexOf('indie') > -1).toBe(true);
        },
      },
    });
  });
});
