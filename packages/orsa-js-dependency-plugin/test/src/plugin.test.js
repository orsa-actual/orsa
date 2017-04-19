/* eslint consistent-return: 0 */
const expect = require('chai').expect;
const sinon = require('sinon');

const Plugin = require('../../src/plugin');

describe('orsa js build plugin', () => {
  it('should not run in the right circumnstances', () => {
    const op = new Plugin();
    expect(op.shouldProcess({
      metadata: {
        get: () => '',
      },
    })).to.not.be.true;
  });

  it('should only run in the right circumnstances', () => {
    const op = new Plugin();
    expect(op.shouldProcess({
      metadata: {
        get: (key) => {
          if (key === 'projectType') {
            return 'node';
          } else if (key === 'builtVersion') {
            return '0.1';
          } else if (key === 'js.modules') {
            return null;
          } else if (key === 'js.packageJSON') {
            return {};
          }
          expect(false).to.be.true;
        },
      },
      version: '0.1',
    })).to.be.true;
  });

  it('should warn on bad node_modules', (done) => {
    const op = new Plugin({
      glob: {
        sync: (pattern, options) => {
          expect(pattern).to.eql('./node_modules/*/package.json');
          expect(options.cwd).to.not.be.null;
          return [
            'a',
          ];
        },
      },
      fs: {
        readFileSync: (path) => {
          expect(path).to.not.be.null;
          return 'foo!';
        },
      },
    });
    const spy = sinon.spy();
    op.initialize({
      logManager: {
        warn: spy,
      },
    });
    op.process({
      localPath: 'foo',
      metadata: {
        set: (key, value) => {
          expect(key).to.eql('js.modules');
          expect(value).to.eql([]);
        },
        get: (key) => {
          if (key === 'js.packageJSON') {
            return {};
          }
        },
      },
      version: '0.1',
    }, () => {
      expect(spy).to.be.called;
      done();
    });
  });

  it('should find node_modules', (done) => {
    const op = new Plugin({
      glob: {
        sync: (pattern, options) => {
          expect(pattern).to.eql('./node_modules/*/package.json');
          expect(options.cwd).to.not.be.null;
          return [
            'a.json',
            'b.json',
            'c.json',
          ];
        },
      },
      fs: {
        readFileSync: (path) => {
          expect(path).to.not.be.null;
          let name = 'a';
          if (path.match(/b\.json$/)) {
            name = 'b';
          }
          if (path.match(/c\.json$/)) {
            name = 'c';
          }
          return JSON.stringify({
            name,
            version: '0.1',
          });
        },
      },
    });
    const spy = sinon.spy();
    op.initialize({
      logManager: {
        warn: spy,
      },
    });
    op.process({
      localPath: 'foo',
      metadata: {
        set: (key, value) => {
          expect(key).to.eql('js.modules');
          expect(value).to.eql([
            {
              name: 'a',
              type: 'direct',
              version: '0.1',
              requestedVersion: '0.1',
            },
            {
              name: 'b',
              type: 'dev',
              version: '0.1',
              requestedVersion: '0.2',
            },
            {
              name: 'c',
              version: '0.1',
            },
          ]
          );
        },
        get: (key) => {
          if (key === 'js.packageJSON') {
            return {
              dependencies: {
                a: '0.1',
              },
              devDependencies: {
                b: '0.2',
              },
            };
          }
        },
      },
      version: '0.1',
    }, () => {
      expect(spy).to.be.called;
      done();
    });
  });
});
