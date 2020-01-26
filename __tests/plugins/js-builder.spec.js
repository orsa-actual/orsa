const { exec } = require('child-process-promise');
const jsBuilder = require('../../src/plugins/js-builder');

jest.mock('child-process-promise');

describe('Javascript Builder', () => {
  it('should try to build', async () => {
    exec.mockResolvedValue({ stdout: 'foo', stderr: 'bar' });
    let obj = null;
    await jsBuilder({}, {
      store: {
        query: () => ({
          data: {
            projects: [
              { id: '1', name: 'bar' },
            ],
          },
        }),
        getById: () => ({ transient: { path: 'bar' }, build: { } }),
        update: (inputObj) => {
          obj = inputObj;
        },
      },
      logger: {
        log: () => {},
        error: () => {},
      },
    });
    expect(obj.test.stdout).toEqual('foo');
  });

  it('should handle build failure', () => {
    exec.mockRejectedValue('woo!');
    jsBuilder({}, {
      store: {
        query: () => ({
          data: {
            projects: [
              { id: '1' },
            ],
          },
        }),
        getById: () => ({ transient: { path: 'bar' }, build: { } }),
        update: () => {},
      },
      logger: {
        log: () => {},
        error: () => {},
      },
    });
  });
});
