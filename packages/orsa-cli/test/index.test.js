/* eslint class-methods-use-this: 0 */
const expect = require('chai').expect;
const index = require('../index');

class FakeOrsa {
  run(cb) {
    cb();
  }

  toObject() {
    return {
      foo: 'bar',
    };
  }
}

class FakeProgram {
  version(ver) {
    expect(ver).to.eql('0.0.3');
    return this;
  }

  option() {
    return this;
  }

  parse() {
    return this;
  }
}

describe('orsa-cli index', () => {
  it('should handle no path', () => {
    const fp = new FakeProgram();
    index({
      program: fp,
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
    const fp = new FakeProgram();
    fp.path = 'foo';
    index({
      program: fp,
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

  it('should run output if requested', () => {
    const fp = new FakeProgram();
    fp.path = 'foo';
    fp.output = 'bar';
    index({
      program: fp,
      Orsa: FakeOrsa,
      fs: {
        readFileSync: () => JSON.stringify({
          version: '0.0.3',
        }),
        writeFileSync: (path, contents) => {
          expect(path).to.eql('bar');
          expect(JSON.parse(contents)).to.eql({
            foo: 'bar',
          });
        },
      },
      process: {
        exit: (status) => {
          expect(status).to.eql(0);
        },
      },
    });
  });
});
