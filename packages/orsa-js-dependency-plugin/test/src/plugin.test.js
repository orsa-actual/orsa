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
          }
          if (key === 'builtVersion') {
            return '0.1';
          }
          if (key === 'node/modules') {
            return null;
          }
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
        warning: spy,
      },
    });
    op.process({
      localPath: 'foo',
      metadata: {
        set: (key, value) => {
          expect(key).to.eql('node/modules');
          expect(value).to.eql({});
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
            'a',
          ];
        },
      },
      fs: {
        readFileSync: (path) => {
          expect(path).to.not.be.null;
          return JSON.stringify({
            name: 'orsa',
            version: '0.1',
          });
        },
      },
    });
    const spy = sinon.spy();
    op.initialize({
      logManager: {
        warning: spy,
      },
    });
    op.process({
      localPath: 'foo',
      metadata: {
        set: (key, value) => {
          expect(key).to.eql('node/modules');
          expect(value).to.eql({
            orsa: '0.1',
          });
        },
      },
      version: '0.1',
    }, () => {
      expect(spy).to.be.called;
      done();
    });
  });
});
