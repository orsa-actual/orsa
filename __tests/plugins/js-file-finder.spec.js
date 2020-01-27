const fs = require('fs');
const glob = require('glob');
const jsFileFinder = require('../../src/plugins/js-file-finder');

jest.mock('fs');
jest.mock('glob');

describe('Javascript Package Indexer', () => {
  it('should index', async () => {
    glob.sync.mockImplementation(() => (['hello']));
    fs.readFileSync.mockImplementation(() => `import React from 'react';

/**
 * HaveSomeClass
 * @description A class
 */
class HaveSomeClass {
  foobar() {
  }
}

/**
 * App
 * @description Test file
 */
const App = () => (<div>Hello</div>);

export default App;`);
    let info = null;
    await jsFileFinder({}, {
      store: {
        query: () => ({
          data: {
            projects: [
              {
                id: '1',
                name: 'bar',
              },
            ],
          },
        }),
        getById: () => ({
          transient: {
            path: 'bar',
          },
        }),
        update: (inf) => {
          info = inf;
        },
      },
      logger: {
        log: () => {},
        error: () => {},
      },
    });
    expect(info).toMatchSnapshot();
  });
});
