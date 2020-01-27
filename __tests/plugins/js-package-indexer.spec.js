const jsPackageIndexer = require('../../src/plugins/js-package-indexer');

describe('Javascript Package Indexer', () => {
  it('should index', async () => {
    let ind = null;
    await jsPackageIndexer({}, {
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
          dependencies: [
            {
              name: 'foo',
              version: '1.0.5',
              requestedVersion: '^1.0.0',
              type: 'direct',
            },
          ],
        }),
        updateIndex: (name, index) => {
          ind = index;
        },
      },
      logger: {
        log: () => {},
        error: () => {},
      },
    });
    expect(ind).toMatchSnapshot();
  });
});
