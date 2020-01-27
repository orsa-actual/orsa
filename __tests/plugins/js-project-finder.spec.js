const fs = require('fs');
const glob = require('glob');
const jsProjectFinder = require('../../src/plugins/js-project-finder');

jest.mock('fs');
jest.mock('glob');

describe('Javascript dependencies', () => {
  it('should scan dependencies', async () => {
    glob.sync.mockReturnValue([]);
    fs.readdirSync.mockReturnValue(['bar']);
    fs.existsSync.mockImplementation((name) => name.indexOf('lerna') < 0);
    fs.readFileSync.mockReturnValue(JSON.stringify({}));
    let obj = null;
    await jsProjectFinder({
      scanDirectories: [
        '.',
      ],
    }, {
      basePath: '/',
      store: {
        update: (inputObj) => {
          obj = inputObj;
        },
      },
      logger: {
        log: () => {},
        error: () => {},
      },
    });
    expect(obj).toEqual({
      id: '311128a3ab878d27e98b4f68914aa64e',
      name: undefined,
      nodeType: 'Project',
      packageJSON: '{}',
      projectType: 'node',
      transient: {
        packageJSON: {},
        path: '/bar',
      },
      version: undefined,
    });
  });

  it('should find lerna projects', async () => {
    glob.sync.mockReturnValue(['zap']);
    fs.readdirSync.mockReturnValue(['bar']);
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue(JSON.stringify({}));
    const objs = {};
    await jsProjectFinder({
      scanDirectories: [
        '.',
      ],
    }, {
      basePath: '/',
      store: {
        update: (inputObj) => {
          objs[inputObj.id] = inputObj;
        },
      },
      logger: {
        log: () => {},
        error: () => {},
      },
    });
    expect(objs).toMatchSnapshot();
  });
});
