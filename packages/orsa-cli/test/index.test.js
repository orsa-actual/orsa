/* eslint class-methods-use-this: 0 */
const expect = require('chai').expect;
const index = require('../index');

class FakeOrsa {
  run(cb) {
    cb();
  }
}

describe('orsa-cli index', () => {
  it('should handle no path', () => {
    index({
      program: {
        path: null,
        version: (ver) => {
          expect(ver).to.eql('0.0.3');
          return {
            option: () => ({
              parse: () => {},
            }),
          };
        },
      },
      fs: {
        readFileSync: () => JSON.stringify({
          version: '0.0.3',
        }),
      },
      console: {
        log: (text) => {
          expect(text).to.eql('No path specified');
        },
      },
      process: {
        exit: (status) => {
          expect(status).to.eql(1);
        },
      },
    });
  });

  it('should run against a path', () => {
    index({
      program: {
        path: 'foo',
        version: (ver) => {
          expect(ver).to.eql('0.0.3');
          return {
            option: () => ({
              parse: () => {},
            }),
          };
        },
      },
      Orsa: FakeOrsa,
      fs: {
        readFileSync: () => JSON.stringify({
          version: '0.0.3',
        }),
      },
      process: {
        exit: (status) => {
          expect(status).to.eql(0);
        },
      },
    });
  });
});
