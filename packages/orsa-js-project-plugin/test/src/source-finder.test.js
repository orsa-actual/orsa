/* eslint consistent-return: 0 */
const expect = require('chai').expect;
const Plugin = require('../../src/source-finder');
const sinon = require('sinon');
const Project = require('orsa-dom').Project;

const jsSample = `
const fs = require('fs');
module.exports = (fname) => fs.readFileSync(fname).toString();
`;

const badJSSample = `
foozbar!!
`;

describe('orsa js source finder plugin', () => {
  it('should only run in the right circumnstances', () => {
    const op = new Plugin();
    expect(op.shouldProcess({
      metadata: {
        get: (name) => {
          if (name === 'versionChanged') {
            return true;
          }
          if (name === 'sourceFinderCompleted') {
            return null;
          }
        },
      },
    })).to.be.true;
    expect(op.shouldProcess({
      metadata: {
        get: (name) => {
          if (name === 'versionChanged') {
            return false;
          }
        },
      },
    })).to.be.false;
    expect(op.shouldProcess({
      metadata: {
        get: (name) => {
          if (name === 'versionChanged') {
            return true;
          }
          if (name === 'sourceFinderCompleted') {
            return true;
          }
        },
      },
    })).to.be.false;
  });

  it('should ignore when there is no local path', (done) => {
    const spy = sinon.spy();
    const op = new Plugin({
      glob: {
        sync: spy,
      },
    });
    op.process({
    }, () => {
      expect(spy.called).to.be.false;
      done();
    });
  });

  it('should glob without locations', (done) => {
    const op = new Plugin({
      glob: {
        sync: (glob, options) => {
          expect(glob).not.to.be.null;
          expect(options).not.to.be.null;
          return [
            'foo',
          ];
        },
      },
      fs: {
        readFileSync: () => jsSample,
      },
    });
    op.initialize({
      emit: () => {},
    }, {});
    const p1 = new Project();
    p1.localPath = 'bar';
    op.process(p1, () => {
      done();
    });
  });

  it('should glob with locations', (done) => {
    const op = new Plugin({
      glob: {
        sync: (glob, options) => {
          expect(glob).to.eql('foo');
          expect(options).not.to.be.null;
          return [
            'foo',
          ];
        },
      },
      fs: {
        readFileSync: () => jsSample,
      },
    });
    op.initialize({
      emit: () => {},
    }, {
      locations: [
        'foo',
      ],
    });
    const p1 = new Project();
    p1.localPath = 'bar';
    op.process(p1, () => {
      expect(p1.children.toArray()[0].metadata.get('javascript/ast')).to.not.be.null;
      expect(p1.children.toArray()[0].metadata.get('javascript/lines')).to.not.be.null;
      done();
    });
  });

  it('should glob with ignore', (done) => {
    const op = new Plugin({
      glob: {
        sync: (glob, options) => {
          expect(glob).to.not.be.null;
          expect(options.ignore).to.eql([
            'foo',
          ]);
          return [
            'foo',
          ];
        },
      },
      fs: {
        readFileSync: () => jsSample,
      },
    });
    op.initialize({
      emit: () => {},
    }, {
      ignore: [
        'foo',
      ],
    });
    const p1 = new Project();
    p1.localPath = 'bar';
    op.process(p1, () => {
      done();
    });
  });

  it('should handle bad Javascript, don\'t we all', (done) => {
    const op = new Plugin({
      glob: {
        sync: (glob, options) => {
          expect(glob).not.to.be.null;
          expect(options).not.to.be.null;
          return [
            'foo',
          ];
        },
      },
      fs: {
        readFileSync: () => badJSSample,
      },
    });
    op.initialize({
      emit: () => {},
      logManager: {
        warning: (t1) => {
          expect(t1).to.eql('Unable to parse foo');
        },
      },
    }, {});
    const p1 = new Project();
    p1.localPath = 'bar';
    op.process(p1, () => {
      done();
    });
  });
});
