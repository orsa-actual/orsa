const fs = require('fs');
const jsProjectFinder = require('../../src/plugins/js-project-finder');

jest.mock('fs');

describe('Javascript dependencies', () => {
  it('should scan dependencies', async () => {
    fs.readdirSync.mockReturnValue(['bar']);
    fs.existsSync.mockReturnValue(true);
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
});
