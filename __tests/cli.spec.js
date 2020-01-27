const fs = require('fs');
const cli = require('../src/cli');
const orsa = require('../src/index');

jest.mock('../src/store');
jest.mock('../src/index');

describe('Main', () => {
  beforeEach(() => {
    console.log = jest.fn();
    console.error = jest.fn();
  });
  
  afterEach(() => {
    console.log.mockClear();
    console.error.mockClear();
  });

  it('should scan', async () => {
    orsa.scan.mockImplementation(() => {});
    orsa.serve.mockImplementation((config, context) => {
      context.logger.warn('foo', 'bar');
      context.logger.error('foo', 'bar');
    });
    const yargs = {
      command: (name, opts, f, cb) => {
        cb({
          build: true,
        });
        return yargs;
      },
      option: () => yargs,
    };
    cli({
      fs: {
        existsSync: () => true,
      },
      yargs,
      require: () => () => ({}),
    });
  });
});
